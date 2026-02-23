import { Event, EventSearchForm } from "../../types/types";
import { StringUtils } from "../../utils/string";
import { httpClientApi } from "./HttpClientApi";

async function createEvent(event: Event): Promise<Event> {
    return httpClientApi.post<Event>("/api/events", { ...event, createdAt: new Date() });
}

async function removeEvent(eventId: string): Promise<Event> {
    return httpClientApi.patch<Event>(`/api/events/${eventId}`, { deleteAt: new Date() });
}

async function updateEvent(event: Event): Promise<Event> {
    return httpClientApi.patch<Event>(`/api/events/${event.id}`, { ...event, updatedAt: new Date() })
}

async function getEvent(id: string): Promise<Event> {
    return httpClientApi.get<Event>("/api/events/" + id);
}

async function getEvents({ title, description, date }: EventSearchForm = { title: "", description: "", date: "asc" },
    abortSignal?: AbortSignal): Promise<Event[]> {

    let query = `?_sort=date&_order=${encodeURI(date)}&`;

    if (!StringUtils.isBlank(title)) {
        query += `title=${encodeURI(title)}&`;
    }
    if (!StringUtils.isBlank(description)) {
        query += `description=${encodeURI(description)}&`;
    }

    return httpClientApi.get<Event[]>("/api/events" + query, abortSignal);
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents }