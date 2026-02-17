import { Event } from "../../types/types";
import { delay } from "../../utils/dalay";
import { HttpClientApi } from "./HttpClient";

async function createEvent(event: Event): Promise<Event> {
    return HttpClientApi.post<Event>("/api/events", { ...event, createdAt: new Date() });
}

async function removeEvent(eventId: string): Promise<Event> {
    return HttpClientApi.patch<Event>(`/api/events/${eventId}`,{ deleteAt: new Date() });
}

async function updateEvent(event: Event): Promise<Event> {
    return HttpClientApi.patch<Event>(`/api/events/${event.id}`, { ...event, updatedAt: new Date() })
}


async function getEvent(id: string): Promise<Event> {
    return HttpClientApi.get<Event>("/api/events/" + id);
}

async function getEvents(): Promise<Event[]> {
    await delay(500)
    return HttpClientApi.get<Event[]>("/api/events");
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents }