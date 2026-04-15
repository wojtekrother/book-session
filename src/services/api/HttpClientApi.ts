import { TokenStorage } from "./auth/TokenStorage"
import axios, { AxiosResponse } from "axios";
import { logoutUser } from "./UserApiQuery";
import z from "zod";

export const httpClientApi = axios.create({
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    },
});

httpClientApi.interceptors.request.use((config) => {
    const tokenStorage = new TokenStorage()
    const token = tokenStorage.getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


httpClientApi.interceptors.request.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logoutUser()
        }
        //TODO other errors suport

        return Promise.reject(error)
    }
);

export const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") return data;
        if (data?.message) return data.message;

        return error.message;
    }

    return "Unexpected error";
};

export const axiosRequest = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
    try {
        const response = await promise;
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(getErrorMessage(error));
        }
        throw error;
    }
}

export type PaginatedListResponse<T> = {
    data: T[],
    meta: {
        totalCount: number
    }
}

export const axiosPaginatedRequestSafe = async <T>
    (promise: Promise<AxiosResponse>, zodSchema: z.ZodType<T>): Promise<PaginatedListResponse<T>> => {
    try {
        const response = await promise;
        return {
            data: zodSchema.array().parse(response.data),
            meta: {
                totalCount: parseInt(response.headers['x-total-count'], 10),
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(getErrorMessage(error));
        }
        throw error;
    }
}

export const axiosRequestSafe = async <T>
    (promise: Promise<AxiosResponse>, zodSchema: z.ZodType<T>): Promise<T> => {
    try {
        const response = await promise;
        return zodSchema.parse(response.data)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(getErrorMessage(error));
        }
        throw error;
    }
}
