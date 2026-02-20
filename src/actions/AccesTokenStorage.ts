export class AccessTokenStorage {
    get = (): string | null => { return localStorage.getItem("accessToken"); }
    set = (accessToken: string): void => { localStorage.setItem("accessToken", accessToken); }
    reset = (): void => { localStorage.removeItem("accessToken"); }
}