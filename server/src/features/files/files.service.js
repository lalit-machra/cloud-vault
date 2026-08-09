import "dotenv/config";
import s3client from "../../common/lib/s3.js";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import prisma from "../../common/lib/prisma.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFile = async ({ userId, originalname, mimetype, size, buffer }) => {
    // upload file to aws s3
    const key = userId + "-" + randomUUID() + "-" + originalname;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        StorageClass: 'INTELLIGENT_TIERING'
    });

    await s3client.send(command);

    // add entry in database
    const file = await prisma.file.create({
        data: {
            userId,
            filename: originalname,
            key,
            size,
            mime: mimetype,
        },
        select: {
            id: true,
            filename: true,
            size: true,
            mime: true,
            createdAt: true
        }
    });

    return file;
}

export const getFile = async ({ fileId, userId, download }) => {
    // get file's key
    const file = await prisma.file.findUnique({
        where: { id: fileId }
    });
    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("File not found");
    const key = file.key;

    // fetch image from aws s3
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ...(download && {
            ResponseContentDisposition: `attachment; filename="${file.filename}"`
        }),
    });

    const fileUrl = await getSignedUrl(s3client, command, {
        expiresIn: 3600
    });

    return { fileName: file.filename, fileSize: file.size, fileMime: file.mime, fileUrl };
}

export const listAll = async ({ userId }) => {
    const allFiles = await prisma.file.findMany({
        where: { userId },
        select: {
            id: true,
            filename: true,
            size: true,
            mime: true,
            createdAt: true
        }
    });

    return allFiles;
}

export const deleteFile = async ({ userId, fileId }) => {
    // get file details from db
    const file = await prisma.file.findUnique({
        where: { id: fileId },
        select: { userId: true, key: true }
    });
    if (!file) throw new Error("No such file");

    if (file.userId !== userId) throw new Error("No such file");
    
    const key = file.key;
    
    // delete file from aws s3
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    });
    await s3client.send(command);

    // delete file from database
    await prisma.file.delete({
        where: { id: fileId }
    });
}