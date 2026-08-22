import "dotenv/config";
import s3client from "../../common/lib/s3.js";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import prisma from "../../common/lib/prisma.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ai from "../../common/lib/openai.js";

// Don't call responses API for these file types
const AUTO_CATEGORY_TYPES = {
    "video/mp4": "Media",
    "audio/mpeg": "Media",
};

const SUMMARY_UNSUPPORTED_TYPES = new Set([
    "video/mp4",
    "audio/mpeg",
]);

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
            category: true,
            summary: true,
            mime: true,
            createdAt: true
        }
    });

    // If file belongs to any of following types, don't send it over for categorization
    if (AUTO_CATEGORY_TYPES[mimetype]) {
        await prisma.file.update({
            where: { id: file.id },
            data: { category: AUTO_CATEGORY_TYPES[mimetype] },
        });
    } else {
        getFileCategory({ fileId: file.id, userId }).catch((err) => {
            console.error(`Categorization failed for ${file.filename}: `, err);
        });
    }

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

// File category is generated upon upload
export const getFileCategory = async ({ fileId, userId }) => {
    // look up file in database
    const file = await prisma.file.findUnique({
        where: { id: fileId },
    });
    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("File not found");

    if (file.category) return { category: file.category };

    const { fileUrl } = await getFile({ fileId, userId, download: false });

    // Use Responses API to get category
    const fileInput = file.mime.startsWith("image/")
        ? {
            type: "input_image",
            image_url: fileUrl,
        }
        : {
            type: "input_file",
            file_url: fileUrl,
        };

    const response = await ai.responses.create({
        model: "gpt-5.6-luna",
        input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: "Categorize this document strictly into one of following categories - Personal, Work, Education, Finance, Media and Others. Return only the category name it belongs to."
                },
                fileInput,
              ],
            },
        ],
    });

    const category = response.output_text;

    // Update category in database
    await prisma.file.update({
        where: { id: fileId },
        data: { category },
    });

    return { category };
}

// fetch the category for polling on frontend
export const fetchFileCategoryStatus = async ({ fileId, userId }) => {
    const file = await prisma.file.findUnique({
        where: { id: fileId },
        select: { userId: true, category: true }
    });
    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("File not found");

    return { category: file.category };
}

export const getFileSummary = async ({ fileId, userId }) => {
    // look up file in database
    const file = await prisma.file.findUnique({
        where: { id: fileId },
    });
    if (!file) throw new Error("File not found");

    if (file.userId !== userId) throw new Error("File not found");

    // Check if summary already exists
    if (file.summary) return { summary: file.summary };

    // Don't generate summary for unsupported file types
    if (SUMMARY_UNSUPPORTED_TYPES.has(file.mime)) {
        const summary = "AI Summary is not supported for this file type.";

        await prisma.file.update({
            where: { id: fileId },
            data: { summary }
        });
    
        return { summary };
    }

    // Use Responses API to get summary
    const { fileUrl } = await getFile({ fileId, userId, download: false });

    const fileInput = file.mime.startsWith("image/")
        ? {
            type: "input_image",
            image_url: fileUrl,
        }
        : {
            type: "input_file",
            file_url: fileUrl,
        };

    const response = await ai.responses.create({
        model: "gpt-5.6-luna",
        input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: "Summarize this file 40-60 words. Focus on the main purpose, key information, important details, and overall takeaway. Do not add or assume information that is not present in the file. Return plain text only; do not use any Markdown or special formatting."
                },
                fileInput,
              ],
            },
        ],
    });
    
    const summary = response.output_text;

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
            category: true,
            summary: true,
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