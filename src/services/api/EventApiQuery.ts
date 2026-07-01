import { InfiniteData, QueryKey, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { EventApi } from "./EventApi";
import { queryClient } from "../../App";
import { EventCreateDTO, EventDTO, EventUpdateDTO } from "../../features/event/schema/event.shema";
import { EventSearchForm } from "../../features/event/schema/eventSearch.schema";
import { PaginatedListResponse } from "./HttpClientApi";
import { StringUtils } from "../../shared/utils/string";



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
        InfiniteData<PaginatedListResponse<EventDTO>>,
        ReturnType<typeof eventKey.infiniteList>,
        number
    >({
        queryKey: eventKey.infiniteList(eventSearchForm),
        queryFn: ({ pageParam, signal }) => EventApi.getPaginatedEvents({ pageParam, eventSearchForm, signal }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages,) => {
            const loaded = allPages.flatMap(p => p.data).length;

            return loaded < lastPage.meta.totalCount
                ? allPages.length
                : undefined;
        }
    });
}

const useUpdateEvent = () => {
    return useMutation<EventDTO, Error, EventUpdateDTO>({
        mutationFn: (event: EventUpdateDTO) => EventApi.updateEvent(event),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKey.all })
    })
}

type EventsContext = {
    previousEvents?: Array<[QueryKey, InfiniteData<PaginatedListResponse<EventDTO>> | undefined]>;
};

const useCreateEvent = () => {
    return useMutation<EventDTO, Error, EventCreateDTO, EventsContext>({
        mutationFn: (event: EventCreateDTO) => EventApi.createEvent(event),
        onMutate: async (newEvent: EventCreateDTO) => {
            await queryClient.cancelQueries({ queryKey: eventKey.all });
            const previousEvents = queryClient.getQueriesData<InfiniteData<PaginatedListResponse<EventDTO>> | undefined>({ queryKey: eventKey.infiniteLists() });
            const optimisticEvent: EventDTO = {
                ...newEvent, id: "optimisti-update", deleted_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            previousEvents.forEach(([queryKey, data]) => {
                const [, , title, description, dateOrder] = queryKey as ReturnType<typeof eventKey.infiniteList>;
                if (data) {
                    //if not visible acording to description not add
                    if (!StringUtils.isBlank(description) && !newEvent.description.includes(description)) {
                        return;
                    }
                    //if not visible acording to title not add
                    if (!StringUtils.isBlank(title) && !newEvent.title.includes(title)) {
                        return;
                    }
                    //add on end or on the beginig acording to dateorder

                    let newData = {
                        ...data,
                        pages: data.pages.map((page, index) => {
                            if (dateOrder === "asc" && index === data.pages.length - 1) {
                                // const lastPageIndex = data.pages.length;
                                return { ...page, page: [...page.data, optimisticEvent], meta: { ...page.meta, totalCount: page.meta.totalCount++ } }
                            } else if (dateOrder === "desc" && index === 0) {
                                return { ...page, data: [optimisticEvent, ...page.data], meta: { ...page.meta, totalCount: page.meta.totalCount++ } }
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

        onError: (err, _newEvent, context) => {
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
                                    return { ...item, deleted_at: new Date() }
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
        onError: (err, _removedEventId, context) => {
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