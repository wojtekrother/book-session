import { useState } from "react";

import useEventSearchApi from "./useEventSearchApi";
import { EventDTO } from "../../../types/types";
import { UseQueryResult } from "@tanstack/react-query";

export type useEventSearchInputsResult = {
    searchQuery: UseQueryResult<EventDTO[], Error>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setDateOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>,
    title: string,
    description: string,
    dateOrder: "asc" | "desc"
}

const useEventSearchInputs = (): useEventSearchInputsResult => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");
    const searchQuery = useEventSearchApi({ title, description, dateOrder });
    return { searchQuery, setTitle, setDescription, setDateOrder, title, description, dateOrder }
}

export default useEventSearchInputs;