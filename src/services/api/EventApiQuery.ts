import { InfiniteData, QueryKey, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { EventApi } from "./EventApi";
import { queryClient } from "../../App";
import { EventCreateDTO, EventDTO, EventUpdateDTO } from "../../features/event/schema/event.shema";
import { EventSearchForm } from "../../features/event/schema/eventSearch.schema";
import { delay } from "../../utils/dalay";
import { PaginatedListResponse } from "./HttpClientApi";
import { useMemo } from "react";


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
        queryFn: ({ signal }) => EventApi.getEvents({ eventSearchForm, signal }),
        placeholderData: (prev) => prev,
    });
}

const useGetEventsInfinite = (eventSearchForm: EventSearchForm = { title: "", description: "", dateOrder: "desc" }) => {

    

    return useInfiniteQuery<PaginatedListResponse<EventDTO>, Error, InfiniteData<PaginatedListResponse<EventDTO>, number>, ['events', EventSearchForm], number>({
        queryKey: ['events', eventSearchForm],
        queryFn: ({ pageParam, signal }) => EventApi.getPaginatedEvents({ pageParam, eventSearchForm, signal }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages,) => {
            // lastPage to obiekt { data, totalCount, nextPage }
            const { meta, data } = lastPage;
            
          
            // Obliczamy, czy są jeszcze strony
            const totalPages = Math.ceil(meta.totalCount / 10); // zakładając 10 elementów na stronę

            if (pages.length <= totalPages) {
                return pages.length + 1;
            }
            return undefined; // Brak kolejnych stron

        }
    });
}

const useUpdateEvent = (event: EventUpdateDTO) => {
    return useMutation<EventDTO, Error, EventUpdateDTO>({
        mutationFn: (event: EventUpdateDTO) => EventApi.updateEvent(event),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] })
    })
}

type EventsContext_old = {
    previousEvents?: EventDTO[];
};

type EventsContext = {
    previousEvents?: Array<[QueryKey, InfiniteData<PaginatedListResponse<EventDTO>> | undefined]>;
};

const useCreateEvent = () => {
    return useMutation<EventDTO, Error, EventCreateDTO, EventsContext>({
        mutationFn: (event: EventCreateDTO) => EventApi.createEvent(event),
        onMutate: async (newEvent: EventCreateDTO) => {
            await queryClient.cancelQueries({ queryKey: ['events'] });
            const previousEvents = queryClient.getQueriesData<InfiniteData<PaginatedListResponse<EventDTO>> | undefined>({ queryKey: ['events'] });
            const optimisticEvent: EventDTO = { ...newEvent, id: crypto.randomUUID() }

            // queryClient.setQueriesData<InfiniteData<PaginatedListResponse<EventDTO>> | undefined>({ queryKey: ['events'] }, (old: any, filter:) => {
            //     if (!old) return old;

            //     if (old.pages) {
            //        // old.
            //         //if event is visible
            //        // optimisticEvent

            //         let oldPages: PaginatedListResponse<EventDTO>[] = old.pages.map((page: PaginatedListResponse<EventDTO>) => {
            //             return {
            //                 ...page, data: page.data.map(item => {
            //                     // if (item.id === removedEventId) {
            //                     //     return { ...item, deleteAt: new Date() }
            //                     // }
            //                     //TODO add created item
            //                     return item
            //                 })
            //             }
            //         });
            //         return { ...old, pages: oldPages }
            //     }

            //     if (Array.isArray(old)) {
            //         return old.filter(event => event.id !== removedEventId);
            //     }
            //     return old

            // });
            return { previousEvents };
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["events"] }),

        onError: (err, newEvent, context) => {
            if (context?.previousEvents) {
                context.previousEvents.forEach(([queryKey, data]) => {
                    queryClient.setQueriesData({ queryKey }, data);
                })

            }
            throw err;
        },
    })
}

const useRemoveEvent = () => {
    return useMutation<EventDTO, Error, string, EventsContext>({
        mutationFn: (id) => EventApi.removeEvent(id),
        onMutate: async (removedEventId: string) => {
            await queryClient.cancelQueries({ queryKey: ['events'] });
            const previousEvents = queryClient.getQueriesData<InfiniteData<PaginatedListResponse<EventDTO>> | undefined>({ queryKey: ['events'] });
            queryClient.setQueriesData<InfiniteData<PaginatedListResponse<EventDTO>> | undefined>({ queryKey: ['events'] }, (old: any) => {
                if (!old) return old;

                if (old.pages) {
                    let oldPages: PaginatedListResponse<EventDTO>[] = old.pages.map((page: PaginatedListResponse<EventDTO>) => {
                        return {
                            ...page, data: page.data.map(item => {
                                if (item.id === removedEventId) {
                                    return { ...item, deleteAt: new Date() }
                                }
                                return item
                            })
                        }
                    });
                    return { ...old, pages: oldPages }
                }

                if (Array.isArray(old)) {
                    return old.filter(event => event.id !== removedEventId);
                }
                return old

            });
            return { previousEvents };
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
        onError: (err, removedEventId, context) => {
            if (context?.previousEvents) {
                context.previousEvents.forEach(([queryKey, data]) => {
                    queryClient.setQueriesData({ queryKey }, data);
                })

            }
            throw err;
        },
    })
}



export { useGetEvent, useGetEvents, useGetEventsInfinite, useUpdateEvent, useCreateEvent, useRemoveEvent };