import { InfiniteData, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { EventApi } from "./EventApi";
import { queryClient } from "../../App";
import { EventCreateDTO, EventDTO, EventUpdateDTO } from "../../features/event/schema/event.shema";
import { EventSearchForm } from "../../features/event/schema/eventSearch.schema";
import { delay } from "../../utils/dalay";


const useGetEvent = (id: string) => {
    return useQuery<EventDTO>({
        queryKey: ['events', id],
        queryFn: () => EventApi.getEvent(id),
        initialData: () => {
            const events = queryClient.getQueryData<EventDTO[]>(["events"])
            return events?.find(e => e.id === id)
        },
        enabled: !!id
    });
};


const useGetEvents = (eventSearchForm: EventSearchForm = { title: "", description: "", dateOrder: "desc" }) => {
    return useQuery<EventDTO[]>({
        queryKey: ['events', eventSearchForm],
        queryFn: ({ signal }) => EventApi.getEvents({eventSearchForm, signal}),
        placeholderData: (prev) => prev,
    });
}

const useGetEventsInfinite = (eventSearchForm: EventSearchForm = { title: "", description: "", dateOrder: "desc" }) => {
    
    return useInfiniteQuery<EventDTO[], Error, InfiniteData<EventDTO[], number>, ['events', EventSearchForm], number>({
        queryKey: ['events', eventSearchForm],
        queryFn: ({ pageParam, signal }) => EventApi.getEvents({ pageParam, eventSearchForm, signal }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.length ? pages.length + 1 : undefined,
    });
}

const useUpdateEvent = (event: EventUpdateDTO) => {
    return useMutation<EventDTO, Error, EventUpdateDTO>({
        mutationFn: (event: EventUpdateDTO) => EventApi.updateEvent(event),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] })
    })
}

type EventsContext = {
    previousEvents?: EventDTO[];
};

const useCreateEvent = () => {
    return useMutation<EventDTO, Error, EventCreateDTO, EventsContext>({
        mutationFn: (event: EventCreateDTO) => EventApi.createEvent(event),
        onMutate: async (newEvent: EventCreateDTO) => {
            await queryClient.cancelQueries({ queryKey: ['events'] });
            const previousEvents = queryClient.getQueryData<EventDTO[]>(['events']);
            const optimisticEvent: EventDTO = { ...newEvent, id: crypto.randomUUID() }

            queryClient.setQueryData<EventDTO[]>(['events'], (old) => {
                if (!old) return [optimisticEvent];
                return [...old, optimisticEvent];
            });
            return { previousEvents: previousEvents };
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
        onError: (err, newEvent, context) => {
            if (context?.previousEvents) {
                queryClient.setQueryData(['events'], context.previousEvents);
            }
        },
    })
}

const useRemoveEvent = (id: string) => {
    return useMutation<EventDTO>({
        mutationFn: () => EventApi.removeEvent(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] })
    })
}



export { useGetEvent, useGetEvents, useGetEventsInfinite, useUpdateEvent, useCreateEvent, useRemoveEvent };