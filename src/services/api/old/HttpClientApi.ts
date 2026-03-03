// @ts-nocheck
import {AccessTokenStorage} from "../../actions/AccesTokenStorage"

class HttpClientApi {
    private accessTokenStorage = new AccessTokenStorage();


    private getAuthHeader(): {} | { Authorization: string } {
        const token = this.accessTokenStorage.get();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    get = async<T>(url: string, abortSignal?: AbortSignal): Promise<T> => {
        return fetchJSON<T>(url, {
            signal: abortSignal,
            headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
            method: 'GET'
        })
    }
    post = async<T>(url: string, body: unknown, abortSignal?: AbortSignal) => {

        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'POST',
            headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
            body: JSON.stringify(body)
        })
    }
    patch = async<T>(url: string, body: unknown, abortSignal?: AbortSignal) => {
        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json", ...this.getAuthHeader()
            },
            body: JSON.stringify(body)
        })
    }
    delete = async<T>(url: string, abortSignal?: AbortSignal) => {
        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'DELETE',
            headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        })
    }

}

const fetchJSON = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
    const response = await fetch(input, init)
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const body = isJson ?
        await response.json() :
        await response.text();
    if (!response.ok) {
        let errorMessage = body?.message ?? body ?? "Unknown error";
        let errorStatusText = response.statusText;

        if (response.status >= 500) {
            throw new Error(`Server Error status:${errorStatusText} errorMessage: ${errorMessage}`);
        }
        else if (response.status >= 400) {
            throw new Error(`Client Error:${errorStatusText} errorMessage: ${errorMessage}`);
        }
    }

    if (!isJson) {
        throw new TypeError("JSON response expected");
    }
    return body as T;
}

export const httpClientApi = new HttpClientApi()