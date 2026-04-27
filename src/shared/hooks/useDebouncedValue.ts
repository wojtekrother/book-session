
import { useEffect, useState } from "react";

const useDebouncedValue = <T>(
    value: T,
    delay: number
) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value]);

    return debouncedValue;
}



export default useDebouncedValue;