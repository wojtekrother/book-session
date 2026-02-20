import { renderHook, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";
import { describe } from "vitest";

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(id);
    }, [value, delay]);

    return {debouncedValue};
}

describe("testy hooka", async () => {
    it("Test hooka debounce", () => {
        
        const {result, rerender} = renderHook(({value, delay})=> useDebounce(value, delay), {initialProps:{value:1, delay:100}})
 
    expect(result.current.debouncedValue).toBe(1)
    vi.useFakeTimers()
    rerender({value:2, delay:100})
    expect(result.current.debouncedValue).toBe(1)
    vi.advanceTimersByTime(50)
    expect(result.current.debouncedValue).toBe(1)
    rerender({value:3, delay:100})
    expect(result.current.debouncedValue).toBe(1)
  
    vi.advanceTimersByTime(100)
    expect(result.current.debouncedValue).toBe(3)
    vi.useRealTimers()
        
    })
    


})
