

import useDebouncedValue from "../../../shared/hooks/useDebouncedValue";
import { useGetEventsInfinite } from "../../../services/api/EventApiQuery";
import { useMemo } from "react";
import { EventSearchForm } from "../schema/eventSearch.schema";

const useEventSearchApiInfinite = (eventSearchForm: EventSearchForm) => {
    const eventSearchFormMemo = useMemo<EventSearchForm>(() => {
        return {
            title: eventSearchForm.title,
            description: eventSearchForm.description,
            categories: eventSearchForm.categories,
            dateOrder: eventSearchForm.dateOrder
        }
    }, [eventSearchForm.title, eventSearchForm.description, eventSearchForm.categories, eventSearchForm.dateOrder]);

    const debouncedEventSearchForm = useDebouncedValue<EventSearchForm>(eventSearchFormMemo, 500);
    return useGetEventsInfinite(debouncedEventSearchForm)
}

export default useEventSearchApiInfinite;