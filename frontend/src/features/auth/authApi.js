import { apiClient } from "../../common/api/client.js";

export const signupApi = async ({ username, email, password }) => {
    const response = await apiClient.post(
        "/auth/signup",
        {
            username,
            email,
            password
        }
    );
    return response.data;
}

export const loginApi = async ({ email, password }) => {
    const response = await apiClient.post(
        "/auth/login",
        {
            email,
            password
        }
    );
    return response.data;
}

export const getUserApi = async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
}