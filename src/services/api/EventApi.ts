import { Event } from "../../types/types";
import { delay } from "../../utils/dalay";

async function createEvent(event: Event): Promise<Event> {
    const response = await fetch("/api/events", {
        method: 'POST',
        body: JSON.stringify({ ...event, createdAt: new Date() })
    })
    delay(1000)
    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

async function removeEvent(eventId: string): Promise<Event> {
    const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify({ deleteAt: new Date() })
    })
    delay(1000)

    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

async function updateEvent(event: Event): Promise<Event> {
    const response = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...event, updatedAt: new Date() })
    })

    if (!response.ok) {
        const errorMessage = await response.text()
        throw Error(`Wrong response status: ${response.statusText} message: ${errorMessage}`)
    }

    return response.json()
}


async function getEvent(id: string): Promise<Event> {
    const response = await fetch("/api/events/" + id)

    if (!response.ok) {
        const errorMessage = await response.text()
        throw Error(`Wrong response status: ${response.statusText} message: ${errorMessage}`)
    }

    return response.json()
}

async function getEvents(): Promise<Event[]> {
    const response = await fetch("/api/events")
    await delay(500)
    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

export const EventApi = { createEvent, removeEvent, updateEvent, getEvent, getEvents }