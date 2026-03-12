import { TokenStorage } from "./auth/TokenStorage"
import axios, { AxiosResponse } from "axios";
import { logoutUser } from "./UserApiQuery";
import z, { ZodSchema } from "zod";

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

export const axiosRequestSafe = async <T extends z.ZodType>
    (promise: Promise<AxiosResponse>, zodSchema: T): Promise<z.infer<T>> => {
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

// const fetchJSON = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
//     const response = await fetch(input, init)
//     const contentType = response.headers.get("content-type");
//     const isJson = contentType?.includes("application/json");
//     const body = isJson ?
//         await response.json() :
//         await response.text();
//     if (!response.ok) {
//         let errorMessage = body?.message ?? body ?? "Unknown error";
//         let errorStatusText = response.statusText;

//         if (response.status >= 500) {
//             throw new Error(`Server Error status:${errorStatusText} errorMessage: ${errorMessage}`);
//         }
//         else if (response.status >= 400) {
//             throw new Error(`Client Error:${errorStatusText} errorMessage: ${errorMessage}`);
//         }
//     }

//     if (!isJson) {
//         throw new TypeError("JSON response expected");
//     }
//     return body as T;
// }

