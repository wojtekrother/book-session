import { useEffect, useRef } from "react";
import { useEventContext } from "../../context/EventContext";
import { EventSearchForm } from "../../types/types";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";

const useEventSearchApi = ({ title, description, dateOrder }: EventSearchForm) => {
    const isFirst = useRef(true);
    const eventCtx = useEventContext();
    const debouncedSearchFn = useDebouncedCallback(
        (title: string, description: string, dateOrder: "asc" | "desc") => {
            eventCtx.search({ title, description, dateOrder });
        },
        500
    );

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }

        debouncedSearchFn(title, description, dateOrder);
        return () => {
            debouncedSearchFn.cancel()
        }
    }, [title, description, dateOrder, debouncedSearchFn])
}

export default useEventSearchApi;