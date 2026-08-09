export const formatSize = (fileSize) => {
    if (!fileSize) return "";
    const kb = fileSize / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    if (gb > 1) {
        return gb.toFixed(2) + " GB";
    } else if (mb > 1) {
        return mb.toFixed(1) + " MB";
    } else if (kb > 1) {
        return kb.toFixed(0) + " KB";
    } else {
        return fileSize + " B"; 
    }
}

export const formatDate = (fileDate) => {
    const date = fileDate.substring(0, 10);
    return date;
}