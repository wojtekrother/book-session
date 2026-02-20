import { Event } from "../../types/types";
import { delay } from "../../utils/dalay";
import { httpClientApi } from "./HttpClientApi";

async function createEvent(event: Event): Promise<Event> {
    return httpClientApi.post<Event>("/api/events", { ...event, createdAt: new Date() });
}

async function removeEvent(eventId: string): Promise<Event> {
    return httpClientApi.patch<Event>(`/api/events/${eventId}`,{ deleteAt: new Date() });
}

async function updateEvent(event: Event): Promise<Event> {
    return httpClientApi.patch<Event>(`/api/events/${event.id}`, { ...event, updatedAt: new Date() })
}


async function getEvent(id: string): Promise<Event> {
    return httpClientApi.get<Event>("/api/events/" + id);
}

async function getEvents(): Promise<Event[]> {
    await delay(500)
    return httpClientApi.get<Event[]>("/api/events");
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents }