import { EventCreateDTO, EventDTO, EventSearchForm, EventUpdateDTO } from "../../types/types";
import { StringUtils } from "../../utils/string";
import { httpClientApi } from "./HttpClientApi";

async function createEvent(event: EventCreateDTO): Promise<EventDTO> {
    return httpClientApi.post<EventDTO>("/api/events", { ...event, createdAt: new Date() });
}

async function removeEvent(eventId: string): Promise<EventDTO> {
    return httpClientApi.patch<EventDTO>(`/api/events/${eventId}`, { deleteAt: new Date() });
}

async function updateEvent(event: EventUpdateDTO): Promise<EventDTO> {
    return httpClientApi.patch<EventDTO>(`/api/events/${event.id}`, { ...event, updatedAt: new Date() })
}

async function getEvent(id: string): Promise<EventDTO> {
    return httpClientApi.get<EventDTO>("/api/events/" + id);
}

async function getEvents({ title, description, dateOrder: date }: EventSearchForm = { title: "", description: "", dateOrder: "asc" },
    abortSignal?: AbortSignal): Promise<EventDTO[]> {

    let query = `?_sort=date&_order=${encodeURI(date)}&`;

    if (!StringUtils.isBlank(title)) {
        query += `title=${encodeURI(title)}&`;
    }
    if (!StringUtils.isBlank(description)) {
        query += `description=${encodeURI(description)}&`;
    }

    return httpClientApi.get<EventDTO[]>("/api/events" + query, abortSignal);
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents }