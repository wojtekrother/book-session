export class HttpClientApi {
    static get = async<T>(url: string, abortSignal?: AbortSignal): Promise<T> => {
        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'GET'
        })
    }
    static post = async<T>(url: string, body: unknown, abortSignal?: AbortSignal) => {

        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
    }
    static patch = async<T>(url: string, body: unknown, abortSignal?: AbortSignal) => {
        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
    }
    static delete = async<T>(url: string, abortSignal?: AbortSignal) => {
        return fetchJSON<T>(url, {
            signal: abortSignal,
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
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