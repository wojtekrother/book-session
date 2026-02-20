import { renderHook, waitFor } from "@testing-library/react";
import { useState, useCallback, act } from "react";

interface User {
    id: number;
    name: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) throw new Error("Login failed");
            const data: User = await res.json();
            setUser(data);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        setError(null);
    }, []);

    return { user, loading, error, login, logout };
}

describe('UesAute test', () => {
    it("1", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockRejectedValueOnce(new Error("Server Error"))
            .mockResolvedValueOnce(
                {
                    ok: false,
                    json: async () => { return { username: "asd1", password: "1234" } }
                } as Response)
            .mockResolvedValue(
                {
                    ok: true,
                    json: async () => { return { username: "asd", password: "1234" } }
                } as Response)

        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toBe(null);
        expect(() => result.current.login("as", "1234")).toThrow("Server Error")
        expect(result.current.user).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("Server Error");

        await act(async () => await result.current.login("asd1", "1234"))
        waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.user).toBe(null);

        expect(result.current.error).toBe("Login failed");


        await act(async () => await result.current.login("asd", "1234"))
        waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.user).toEqual({ username: "asd", password: "1234" });
        expect(result.current.error).toBe(null);
    })



})