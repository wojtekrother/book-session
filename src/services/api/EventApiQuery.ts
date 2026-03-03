import { useMutation, useQuery } from "@tanstack/react-query"
import { EventApi } from "./EventApi";
import { EventCreateDTO, EventDTO, EventSearchForm, EventUpdateDTO } from "../../types/types";
import { queryClient } from "../../App";





const useGetEvent = (id: string) => {
    return useQuery<EventDTO>({
        queryKey: ['events', id],
        queryFn: () => EventApi.getEvent(id),
        enabled: !!id
    });
};


const useGetEvents = (eventSearchForm: EventSearchForm = { title: "", description: "", dateOrder: "asc" }) => {
    return useQuery<EventDTO[]>({
        queryKey: ['events', eventSearchForm],
        queryFn: ({ signal }) => EventApi.getEvents(eventSearchForm, signal),
        placeholderData: (prev) => prev
    });
}

const useUpdateEvent = (event: EventUpdateDTO) => {
    return useMutation<EventDTO, Error, EventUpdateDTO>({
        mutationFn: (event :EventUpdateDTO) => EventApi.updateEvent(event),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] })
    })
}

const useCreateEvent = () => {
    return useMutation<EventDTO, Error, EventCreateDTO>({
        mutationFn: (event:EventCreateDTO) => EventApi.createEvent(event),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] })
    })
}

const useRemoveEvent = (id: string) => {
    return useMutation<EventDTO>({
        mutationFn: () => EventApi.removeEvent(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] })
    })
}



export { useGetEvent, useGetEvents, useUpdateEvent, useCreateEvent, useRemoveEvent };