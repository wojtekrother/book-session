
import { StringUtils } from "../../shared/utils/string";
import { axiosRequestSafe, httpClientApi, PaginatedListResponse, paginatedSafeQuery, safeArrayQuery, safeQuery } from "./HttpClientApi";
import { EventCreateDTO, EventDTO, EventUpdateDTO, eventSchema } from "../../features/event/schema/event.shema";
import { delay } from "../../shared/utils/dalay";
import { EventSearchForm } from "../../features/event/schema/eventSearch.schema";
import z from "zod";
import { supabase } from "./supabase";
import { each } from "lodash";


async function createEvent(event: EventCreateDTO): Promise<EventDTO> {
    await delay(3000);

    let query = supabase.from("events").insert({
        title: event.title,
        description: event.description,
        duration: event.duration,
        summary: event.summary,
        date: event.date,
        image: event.image,
        image_url: event.imageUrl
    }).select().single();
    const createdEvent: EventDTO = await safeQuery(query, eventSchema)
    return createdEvent;
}

async function removeEvent(eventId: string): Promise<EventDTO> {
    await delay(3000);
    let query = supabase.from("events").update({
        delete_at: new Date().toISOString()
    })
        .eq("id", eventId)
        .select()
        .single();

    const removedEvent: EventDTO = await safeQuery(query, eventSchema)
    return removedEvent;
}

async function updateEvent(event: EventUpdateDTO): Promise<EventDTO> {
    let query = supabase.from("events").update({
        ...event,
        update_at: new Date().toISOString(),
    })
        .eq("id", event.id)
        .select()
        .single();

    const updatedEvent: EventDTO = await safeQuery(query, eventSchema)
    return updatedEvent;
}

async function getEvent(id: string): Promise<EventDTO> {
    let query = supabase.from("events").select("*")
        .eq("id", id)
        .single();

    const event: EventDTO = await safeQuery(query, eventSchema)
    return event;
}



export type GetEventProps = {
    pageParam?: number,
    eventSearchForm: EventSearchForm,
    signal?: AbortSignal
}

async function getEvents({ pageParam, eventSearchForm, signal: abortSignal }: GetEventProps): Promise<EventDTO[]> {
    await delay(2000)

    let query = supabase.from("events").select("*");

    if (!StringUtils.isBlank(eventSearchForm.title)) {
        query = query.ilike("title", `%${eventSearchForm.title}%`);
    }

    if (!StringUtils.isBlank(eventSearchForm.description)) {
        query = query.ilike("description", `%${eventSearchForm.description}%`);
    }


    query = query.order("date", { ascending: eventSearchForm.dateOrder === "asc" });
    if (abortSignal) {
        query = query.abortSignal(abortSignal);
    }

    return await safeArrayQuery<EventDTO>(
        query,
        eventSchema)

    let queryParams: Record<string, string> = {
        _sort: "date",
        _order: encodeURI(eventSearchForm.dateOrder)
    }

    if (!StringUtils.isBlank(eventSearchForm.title)) {
        queryParams.title = encodeURI(eventSearchForm.title);
    }
    if (!StringUtils.isBlank(eventSearchForm.description)) {
        queryParams.description = encodeURI(eventSearchForm.description);
    }

    const response = await axiosRequestSafe<EventDTO[]>(
        httpClientApi.get("/api/events", {
            signal: abortSignal, params: {
                ...queryParams
            }
        }),
        eventSchema.array());
    return response;
}

async function getPaginatedEvents({ pageParam, eventSearchForm, signal: abortSignal }: GetEventProps): Promise<PaginatedListResponse<EventDTO>> {
    await delay(500)

    const pageSize = 10;

    const from = pageParam ? (pageParam - 1) * pageSize : 0;
    const to = from + pageSize - 1;

    let query = supabase.from("events").select("*", {count: "planned"});
    if (!StringUtils.isBlank(eventSearchForm.title)) {
        query = query.ilike("title", `%${eventSearchForm.title}%`);
    }
    if (!StringUtils.isBlank(eventSearchForm.description)) {
        query = query.ilike("description", `%${eventSearchForm.description}%`);
    }
    query = query.order("date", { ascending: eventSearchForm.dateOrder === "asc" });
    query = query.order("id", { ascending: eventSearchForm.dateOrder === "asc" })
    query = query.range(from, to);

    if (abortSignal) {
        query = query.abortSignal(abortSignal);
    }

    return await paginatedSafeQuery<EventDTO>(
        query,
        eventSchema)
}


async function copyEventsFromJSONToSupabase() {
    const response = await axiosRequestSafe<EventDTO[]>(
        httpClientApi.get("/api/events" ),
        eventSchema.array());
    response.forEach(event => {
        const {id, createdAt, modifiedAt, deleteAt, ...eventWithoutId} = event
        const createEventDTO:EventCreateDTO = eventWithoutId;
        createEvent(
            createEventDTO
        )
    });    

    return response;
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents, getPaginatedEvents }