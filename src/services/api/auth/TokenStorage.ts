export class TokenStorage {
    getAccessToken = (): string | null => { return localStorage.getItem("accessToken"); }
    setAccessToken = (accessToken: string): void => { localStorage.setItem("accessToken", accessToken); }
    getRefreshToken = (): string | null => { return localStorage.getItem("refreshToken"); }
    setRefreshToken = (refreshToken: string): void => { localStorage.setItem("refreshToken", refreshToken); }
    reset = (): void => { 
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken"); }
}