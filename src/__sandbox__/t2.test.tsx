
import { act, renderHook, waitFor } from "@testing-library/react";
import { useState, useCallback } from "react";
import { expect } from "vitest";

import { useEffect  } from "react";

interface User {
    id: number;
    name: string;
}

export function useFetchData(url: string) {
    const [data, setData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Network error");
            const json: User[] = await res.json();
            setData(json);
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

it("Test hooka", async () => {
    const mockFn = vi.spyOn(globalThis, "fetch")
    .mockRejectedValueOnce(new Error("Server error"))
    .mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 1, name: "Alice" }]
        } as Response)
     
    const { result } = renderHook(() => useFetchData(""));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
    await waitFor(()=> {
        expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toBe("Server error");
    expect(result.current.data).toBe(null);
    expect(mockFn).toHaveBeenCalledOnce()
    act(() =>{result.current.refetch()})
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    await waitFor(()=> {
        expect(result.current.loading).toBe(false)
    })
expect(result.current.data).toEqual([{ id: 1, name: "Alice" }]);
expect(result.current.error).toBe(null);
expect(mockFn).toHaveBeenCalledTimes(2)
})

it("Test hooka", async () => {
    const mockFn = vi.spyOn(globalThis, "fetch")
    .mockRejectedValueOnce(new Error("Server error"))
    .mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 1, name: "Alice" }]
        } as Response)
     
    const { result, rerender } = renderHook(() => useFetchData(""));

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
    await waitFor(()=> {
        expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toBe("Server error");
    expect(result.current.data).toBe(null);
    expect(mockFn).toHaveBeenCalledOnce()
    rerender("")//ponowny render z tymi samymi parametrami
  
    expect(result.current.error).toBe("Server error");
    await waitFor(()=> {
        expect(result.current.loading).toBe(false)
    })

expect(mockFn).toHaveBeenCalledTimes(1)
})