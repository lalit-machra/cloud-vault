import "dotenv/config";
import s3client from "../../common/lib/s3.js";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import prisma from "../../common/lib/prisma.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import ai from "../../common/lib/gemini.js";

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

const getFileReadable = async ({ key }) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    const response = await s3client.send(command);

    return Readable.from(response.Body);
}

// File category is generated upon upload
export const getFileCategory = async ({ fileId, userId }) => {
    // look up file in database
    const file = await prisma.file.findUnique({
        where: { id: fileId },
    });
    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("File not found");

    // Upload file to Gemini Files API
    const readable = await getFileReadable({ key: file.key });
    const fileRef = await ai.files.upload({
        file: readable,
        mimeType: file.mime,
    });

    // Use Interactions API to get category
    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: [
            fileRef,
            {text: "Categorize this document into one of following categories - personal, work, others"}
        ]
    });

    const category = interaction.output_text;

    // Update category, file uri, and file upload time in database
    const geminiFileUri = fileRef.name;
    const geminiUploadedAt = new Date();
    await prisma.file.update({
        where: { id: fileId },
        data: { category, geminiFileUri, geminiUploadedAt },
    });

    return { category };
}

export const getFileSummary = async ({ fileId, userId }) => {
    // look up file in database
    const file = await prisma.file.findUnique({
        where: { id: fileId },
    });
    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("File not found");

    if (file.summary) return { summary: file.summary };

    // Access the file
    let fileRef;
    const isStillValid = (Date.now() - new Date(file.geminiUploadedAt).getTime()) < (48 * 60 * 60 * 1000);
    if (file.geminiFileUri && isStillValid) {
        // If file was uploaded less than 48 hours ago, no need to upload file again
        fileRef = await ai.files.get({ name: file.geminiFileUri });
    } else {
        // Upload file again to Gemini Files API
        const readable = await getFileReadable({ key: file.key });
        fileRef = await ai.files.upload({
            file: readable,
            mimeType: file.mime,
        });
    }
    
    // Use Interactions API to get summary
    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: [
            fileRef,
            { text: "Provide a short and precise summary for this document." }
        ]
    });

    const summary = interaction.output_text;

    // Update summary in database
    await prisma.file.update({
        where: { id: fileId },
        data: { summary }
    });

    return { summary };
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