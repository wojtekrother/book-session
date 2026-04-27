

import useDebouncedValue from "../../../shared/hooks/useDebouncedValue";
import { useGetEventsInfinite } from "../../../services/api/EventApiQuery";
import { useMemo } from "react";
import { EventSearchForm } from "../schema/eventSearch.schema";

const useEventSearchApiInfinite = (eventSearchForm: EventSearchForm) => {
    const eventSearchFormMemo = useMemo<EventSearchForm>(() => { 
        return { title: eventSearchForm.title, 
            description: eventSearchForm.description, 
            dateOrder: eventSearchForm.dateOrder } 
        }, [eventSearchForm.title, eventSearchForm.description, eventSearchForm.dateOrder]);

    const debouncedEventSearchForm = useDebouncedValue<EventSearchForm>(eventSearchFormMemo, 500);
    return useGetEventsInfinite(debouncedEventSearchForm)
}

export default useEventSearchApiInfinite;