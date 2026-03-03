
import { EventSearchForm } from "../../types/types";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { useGetEvents } from "../../services/api/EventApiQuery";
import { useMemo } from "react";

const useEventSearchApi = (eventSearchForm: EventSearchForm) => {
    const eventSearchFormMemo = useMemo<EventSearchForm>(() => { 
        return { title: eventSearchForm.title, 
            description: eventSearchForm.description, 
            dateOrder: eventSearchForm.dateOrder } 
        }, [eventSearchForm.title, eventSearchForm.description, eventSearchForm.dateOrder]);

        //second option
        //const debouncedTitle = useDebouncedValue<string>(eventSearchFormMemo.title, 500);
        //const debouncedDescription = useDebouncedValue<string>(eventSearchFormMemo.description, 500);
        //return useGetEvents({...eventSearchForm, title: debouncedTitle, description:debouncedDescription})

    const debouncedEventSearchForm = useDebouncedValue<EventSearchForm>(eventSearchFormMemo, 500);
    return useGetEvents(debouncedEventSearchForm)
}

export default useEventSearchApi;