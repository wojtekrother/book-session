import { useState } from "react";

import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { EventCategory, EventDTO } from "../schema/event.schema";
import useEventSearchApiInfinite from "./useEventSearchApiInfinite";
import { PaginatedListResponse } from "../../../services/api/HttpClientApi";
import { eventSearchDateOrderEnum, EventSearchDateOrderEnum } from "../schema/eventSearch.schema";

export type useEventSearchInputsInfiniteResult = {
    searchQueryInfinite: UseInfiniteQueryResult<InfiniteData<PaginatedListResponse<EventDTO>>, Error>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setCategories: React.Dispatch<React.SetStateAction<EventCategory[]>>,
    setDateOrder: React.Dispatch<React.SetStateAction<EventSearchDateOrderEnum>>,
    title: string,
    description: string,
    categories: EventCategory[],
    dateOrder: EventSearchDateOrderEnum
}

const useEventSearchInputsInfinite = (): useEventSearchInputsInfiniteResult => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dateOrder, setDateOrder] = useState<EventSearchDateOrderEnum>(eventSearchDateOrderEnum.enum.desc);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const searchQueryInfinite = useEventSearchApiInfinite({ title, description, categories, dateOrder });
    return {
        searchQueryInfinite, setTitle, setDescription, setCategories, setDateOrder,
        title, description, categories, dateOrder
    }
}

export default useEventSearchInputsInfinite;