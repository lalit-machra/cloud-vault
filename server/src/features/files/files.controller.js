import { deleteFile, listAll, uploadFile, getFile } from "./files.service.js";

export const uploadFileController = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (!req.file) throw new Error("No valid file found");
        const { originalname, mimetype, buffer, size } = req.file;
        
        const result = await uploadFile({ userId, originalname, mimetype, size, buffer });
        
        return res.status(201).json({ file: result });
    } catch(err) {
        next(err);
    }
}

export const getFileController = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const userId = req.user.userId;
        const download = req.query.download === "true";
        const file = await getFile({ fileId, userId, download });
        res.status(200).json(file);
    } catch(err) {
        next(err);
    }
}

export const listAllFilesController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const allFiles = await listAll({ userId });
        res.status(200).json(allFiles);
    } catch(err) {
        next(err);
    }
}

export const deleteFileController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { fileId } = req.params;
        await deleteFile({ userId, fileId });
        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
}