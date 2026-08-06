export const formatSize = (fileSize) => {
    const kb = fileSize / 1024;
    const mb = kb / 1024;
    if (mb > 1) {
        return mb.toFixed(1) + "MB";
    } else {
        return kb.toFixed(1) + "KB";
    }
}

export const formatDate = (fileDate) => {
    const date = fileDate.substring(0, 10);
    return date;
}