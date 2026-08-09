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