import { InfiniteData, QueryFilters, QueryKey, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { EventApi } from "./EventApi";
import { queryClient } from "../../App";
import { EventCreateDTO, EventDTO, EventUpdateDTO } from "../../features/event/schema/event.shema";
import { EventSearchForm } from "../../features/event/schema/eventSearch.schema";
import { delay } from "../../utils/dalay";
import { PaginatedListResponse } from "./HttpClientApi";
import { useMemo } from "react";
import { StringUtils } from "../../utils/string";
import { meta } from "zod/v4/core";


export const eventKey = {
    all: ["events"] as const,
    lists: () => [...eventKey.all, "list"] as const,
    list: ({ title, description, dateOrder }: EventSearchForm) =>
        [...eventKey.lists(), title, description, dateOrder] as const,

    infiniteLists: () => [...eventKey.all, "infiniteList"] as const,
    infiniteList: ({ title, description, dateOrder }: EventSearchForm) =>
        [...eventKey.infiniteLists(), title, description, dateOrder] as const,

    details: () => [...eventKey.all, "details"] as const,
    detail: (id: string) => [...eventKey.details(), id] as const
}


const useGetEvent = (id: string) => {
    return useQuery<EventDTO>({
        queryKey: eventKey.detail(id),
        queryFn: () => EventApi.getEvent(id),
        initialData: () => {
            const events = queryClient.getQueryData<EventDTO[]>(eventKey.all)
            return events?.find(e => e.id === id)
        },
        enabled: !!id
    });
};


const useGetEvents = (eventSearchForm: EventSearchForm = { title: "", description: "", dateOrder: "desc" }) => {
    return useQuery<EventDTO[]>({
        queryKey: eventKey.list(eventSearchForm),
        queryFn: ({ signal }) => EventApi.getEvents({ eventSearchForm, signal }),
        placeholderData: (prev) => prev,
    });
}

const useGetEventsInfinite = (eventSearchForm: EventSearchForm = { title: "", description: "", dateOrder: "desc" }) => {



    return useInfiniteQuery<PaginatedListResponse<EventDTO>, Error,
        PaginatedListResponse<EventDTO>,
        ReturnType<typeof eventKey.infiniteList>,
        number
    >({
        queryKey: eventKey.infiniteList(eventSearchForm),
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKey.all })
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
            await queryClient.cancelQueries({ queryKey: eventKey.all });
            const previousEvents = queryClient.getQueriesData<InfiniteData<PaginatedListResponse<EventDTO>> | undefined>({ queryKey: eventKey.infiniteLists() });
            const optimisticEvent: EventDTO = { ...newEvent, id: crypto.randomUUID() }




            previousEvents.forEach(([queryKey, data]) => {
                const [, , title, description, dateOrder] = queryKey as ReturnType<typeof eventKey.infiniteList>;
                if (data) {
                    //if not visible acording to description not add
                    if (!StringUtils.isBlank(description) && newEvent.description !== description) {
                        return;
                    }
                    //if not visible acording to title not add
                    if (!StringUtils.isBlank(title) && newEvent.title !== title) {
                        return;
                    }
                    //add on end or on the beginig acording to dateorder

                    let newData = {
                        ...data,
                        pages: data.pages.map((page, index) => {
                            if (dateOrder === "asc" && index === data.pages.length - 1) {
                                // const lastPageIndex = data.pages.length;
                                return { ...page, page: [...page.data, newEvent], meta: { ...page.meta, totalCount: page.meta.totalCount++ } }
                            } else if (dateOrder === "desc" && index === 0) {
                                return { ...page, data: [newEvent, ...page.data], meta: { ...page.meta, totalCount: page.meta.totalCount++ } }
                            } else {
                                return { ...page, meta: { ...page.meta, totalCount: page.meta.totalCount++ } }
                            }
                        })
                    }
                    queryClient.setQueryData(queryKey, newData)
                }
            });

            return { previousEvents };
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: eventKey.all }),

        onError: (err, newEvent, context) => {
            if (context?.previousEvents) {
                context.previousEvents.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
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
            await queryClient.cancelQueries({ queryKey: eventKey.all });
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKey.all }),
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