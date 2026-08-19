import { apiClient } from "@/common/api/client";

export const listFiles = async () => {
    const allFiles = await apiClient.get("/files/");
    return allFiles.data;
}

export const fileUpload = async (files) => {
    const formData = new FormData();
    formData.append("name", files);
    const file = await apiClient.post("/files/", formData, {
        timeout: 60000
    });
    return file.data.file;
}

export const getFile = async (fileId, download) => {
    const file = await apiClient.get(`/files/${fileId}${download ? "?download=true" : ""}`);   
    return file.data;
}

export const deleteFile = async (fileId) => {
    const response = await apiClient.delete(`/files/${fileId}`);
    return response;
}

export const pollForCategory = async ({fileId, updateFileUponCategory, maxAttempts=6, intervalMs=3000}) =>  {
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        try {
            const { category }  = await apiClient.get(`/files/?fileId=${fileId}/category`);
            if (category) {
                updateFileUponCategory(fileId, category);
                return;
            }
        } catch(err) {
            console.error("Polling failed: ", err);
            return;
        }
    }
    
    return null;
}

export const getSummary = async ({ fileId }) => {
    try {
        const { summary } = await apiClient.get(`/files/summary?fileId=${fileId}`);
        return summary;
    } catch(err) {
        console.error("Couldn't fetch summary: ", err);
        return null;
    }
}