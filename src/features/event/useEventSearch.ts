import {  useEffect, useMemo, useState } from "react";
import { useEventContext } from "../../context/EventContext";
import { debounce } from "lodash";

const useEventSearch = () => {
const eventCtx = useEventContext();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");
    

    const debouncedSearchFn = useMemo(() =>
        debounce((title, description, dateOrder) => {
            eventCtx.search({ title, description, date: dateOrder })
        }, 1000), [eventCtx.search])

    useEffect(() => {
        debouncedSearchFn(title, description, dateOrder);
        return () => {
            debouncedSearchFn.cancel()
        }
    }, [title, description, dateOrder, debouncedSearchFn])

    return {setTitle, setDescription, setDateOrder, title, description, dateOrder}
}

export default useEventSearch;