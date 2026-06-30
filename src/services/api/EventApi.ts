
import { StringUtils } from "../../shared/utils/string";
import { PaginatedListResponse, paginatedSafeQuery, safeArrayQuery, safeQuery } from "./HttpClientApi";
import { EventCreateDTO, EventDTO, EventUpdateDTO, eventSchema } from "../../features/event/schema/event.shema";
import { delay } from "../../shared/utils/dalay";
import { EventSearchForm } from "../../features/event/schema/eventSearch.schema";
import { supabase } from "./supabase";

async function createEvent(event: EventCreateDTO): Promise<EventDTO> {
    await delay(3000);

    let query = supabase.from("events").insert({
        title: event.title,
        description: event.description,
        duration: event.duration,
        summary: event.summary,
        category: event.category,
        date: event.date
    }).select().single();

    
    const createdEvent: EventDTO = await safeQuery(query, eventSchema)
    if (createdEvent.id !== undefined && event.image) {
        await saveEventImage(createdEvent.id, event.image)
    }
    

    return createdEvent;
}

const createThumbnail = async (file: File): Promise<Blob> => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    await new Promise(resolve => {
        img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 200;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 300, 200);

    return await new Promise(resolve =>
        canvas.toBlob(blob => resolve(blob!), "image/jpeg", 0.8)
    );
};

async function saveEventImage(eventId: string, file: File): Promise<void> {
    const { error: error_original } = await supabase.storage
        .from("events_images")
        .upload(`${eventId}/original`, file);
    
        if (error_original) {
            throw error_original;
        }

    const { error: error_tumnail } = await supabase.storage
        .from("events_images")
        .upload(`${eventId}/thumb`, await createThumbnail(file));
        if (error_tumnail) {
            throw error_tumnail
        }
}

function getEventImageOriginal(eventId: string): string {
    return supabase.storage.from("events_images").getPublicUrl(`${eventId}/original`).data.publicUrl;
}

function getEventImageTumbnail(eventId: string): string {
    return supabase.storage.from("events_images").getPublicUrl(`${eventId}/thumb`).data.publicUrl;
}

async function removeEvent(eventId: string): Promise<EventDTO> {
    await delay(3000);
    let query = supabase.from("events").update({
        deleted_at: new Date().toISOString()
    })
        .eq("id", eventId)
        .select()
        .single();

    const removedEvent: EventDTO = await safeQuery(query, eventSchema)
    return removedEvent;
}

async function updateEvent(event: EventUpdateDTO): Promise<EventDTO> {
    let query = supabase.from("events").update(event)
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

async function getEvents({ eventSearchForm, signal: abortSignal }: GetEventProps): Promise<EventDTO[]> {
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
}

async function getPaginatedEvents({ pageParam, eventSearchForm, signal: abortSignal }: GetEventProps): Promise<PaginatedListResponse<EventDTO>> {
    await delay(500)

    const pageSize = 10;

    const from = pageParam ? (pageParam - 1) * pageSize : 0;
    const to = from + pageSize - 1;

    let query = supabase.from("events").select("*", { count: "planned" });
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

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents, getPaginatedEvents, getEventImageOriginal, getEventImageTumbnail }