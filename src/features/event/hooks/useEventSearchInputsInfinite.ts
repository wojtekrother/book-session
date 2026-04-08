import { useState } from "react";

import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/react-query";
import { EventDTO } from "../schema/event.shema";
import useEventSearchApiInfinite from "./useEventSearchApiInfinite";

export type useEventSearchInputsInfiniteResult = {
    searchQueryInfinite: UseInfiniteQueryResult<InfiniteData<EventDTO[]>, Error>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setDateOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>,
    title: string,
    description: string,
    dateOrder: "asc" | "desc"
}

const useEventSearchInputsInfinite = (): useEventSearchInputsInfiniteResult => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");
    const searchQueryInfinite = useEventSearchApiInfinite({ title, description, dateOrder });
    return { searchQueryInfinite, setTitle, setDescription, setDateOrder, title, description, dateOrder }
}

export default useEventSearchInputsInfinite;