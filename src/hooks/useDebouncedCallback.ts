import { debounce } from "lodash";
import { useEffect, useMemo } from "react";

const useDebouncedCallback = <T extends (...args: any[]) => void>(
    callback: T,
    delay: number
) => {
    const debouncedFn = useMemo(() => {
        return debounce(callback, delay);
    }, [callback, delay]);

    useEffect(() => {
        return () => {
            debouncedFn.cancel();
        };
    }, [debouncedFn]);

    return debouncedFn;
}


export default useDebouncedCallback;