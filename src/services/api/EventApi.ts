import { EventCreateDTO, EventDTO, EventSearchForm, EventUpdateDTO } from "../../types/types";
import { StringUtils } from "../../utils/string";
import { axiosRequestSafe, httpClientApi } from "./HttpClientApi";
import { eventSchema } from "../../features/event/schema/event.shema";


async function createEvent(event: EventCreateDTO): Promise<EventDTO> {
    const response = await axiosRequestSafe(
        httpClientApi.post<EventDTO>("/api/events", { ...event, createdAt: new Date() }),
        eventSchema);
    return response;
}

async function removeEvent(eventId: string): Promise<EventDTO> {
    const response = await axiosRequestSafe(
        httpClientApi.patch<EventDTO>(`/api/events/${eventId}`, { deleteAt: new Date() }),
        eventSchema);
    return response;
}

async function updateEvent(event: EventUpdateDTO): Promise<EventDTO> {
    const response = await axiosRequestSafe(
        httpClientApi.patch<EventDTO>(`/api/events/${event.id}`, { ...event, updatedAt: new Date() }),
        eventSchema);
    return response;
}

async function getEvent(id: string): Promise<EventDTO> {
    const response = await axiosRequestSafe(
        httpClientApi.get<EventDTO>("/api/events/", { params: { id } }),
        eventSchema);
    return response;
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

    const response = await axiosRequestSafe(
        httpClientApi.get("/api/events" + query, { signal: abortSignal }),
        eventSchema.array());
    return response;
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents }