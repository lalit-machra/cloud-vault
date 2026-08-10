import { Image, FileText, FileVideo, FileAudio,     File } from "lucide-react";

export function searchFiles({ allFiles, keyword }) {
    const copyAllFiles = [...allFiles];
    return copyAllFiles.filter((file) => file.filename.toLowerCase().includes(keyword.toLowerCase()));
}

export function sortFiles({ allFiles, option }) {
    const copyAllFiles = [...allFiles];
    if (option === "name-asc") {
        return copyAllFiles.sort((a, b) => a.filename.localeCompare(b.filename));
    } else if (option === "name-desc") {
        return copyAllFiles.sort((a, b) => b.filename.localeCompare(a.filename));
    } else if (option === "date-asc") {
        return copyAllFiles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (option === "date-desc") {
        return copyAllFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (option === "size-asc") {
        return copyAllFiles.sort((a, b) => a.size - b.size);
    } else if (option === "size-desc") {
        return copyAllFiles.sort((a, b) => b.size - a.size);
    } else {
        return copyAllFiles;
    }
}

export function getFileIcon(mimetype) {
    switch (mimetype) {
        case "image/jpeg":
            return "/public/jpg-image-file-icon.svg";
        case "image/png":
            return "/public/png-image-file-icon.svg";
        case "application/pdf":
            return "/public/red-pdf-icon.svg";
        case "text/plain":
            return "/public/txt-file-icon.svg";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "/public/blue-docx-icon.svg";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return "/public/green-xls-excel-file-icon.svg";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "/public/powerpoint-icon.svg";
        case "image/svg+xml":
            return "/public/red-svg-file-icon.svg";
        case "video/mp4":
            return "/public/red-video-file-icon.svg";
        default:
            return "/public/general-file.svg";
    }
}