import { apiClient } from "@/common/api/client";

export const listFiles = async () => {
    const allFiles = await apiClient.get("/files/");
    return allFiles.data;
}