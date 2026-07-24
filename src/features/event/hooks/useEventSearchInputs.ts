import { useState } from "react";

import useEventSearchApi from "./useEventSearchApi";
import { UseQueryResult } from "@tanstack/react-query";
import { EventCategory, EventDTO } from "../schema/event.schema";
import { eventSearchDateOrderEnum, EventSearchDateOrderEnum } from "../schema/eventSearch.schema";

export type useEventSearchInputsResult = {
    searchQuery: UseQueryResult<EventDTO[], Error>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setCategories: React.Dispatch<React.SetStateAction<EventCategory[]>>,
    setDateOrder: React.Dispatch<React.SetStateAction<EventSearchDateOrderEnum>>,
    title: string,
    description: string,
    categories: EventCategory[],
    dateOrder: EventSearchDateOrderEnum
}

const useEventSearchInputs = (): useEventSearchInputsResult => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [categories, setCategories] = useState<EventCategory[]>([])
    const [dateOrder, setDateOrder] = useState<EventSearchDateOrderEnum>(eventSearchDateOrderEnum.enum.desc);
    const searchQuery = useEventSearchApi({ title, description, categories, dateOrder });
    return {
        searchQuery, setTitle, setDescription, setCategories, setDateOrder,
        title, description, categories, dateOrder
    }
}

export default useEventSearchInputs;