import { useCallback, useEffect, useState } from "react";

// Hook
export function useRetryFetch(url: string) {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        let attempts = 0;
        while (attempts < 3) {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("Fetch failed");
                const json = await res.json();
                setData(json);
                break;
            } catch (e: unknown) {
                attempts++;
                if (attempts === 3 && e instanceof Error) setError(e.message);
            }
        }
        setLoading(false);
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, loading, refetch: fetchData };
}

describe("useRetryFetch test", () => {
    it("asdfas", () => {
        vi.spyOn(globalThis, "fetch")
        .mockRejectedValueOnce(new Error("Server Error"))
        .mockResolvedValueOnce(async () => {})
    })
})