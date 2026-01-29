import { BookSession } from "../types/types";
import { delay } from "../utils/dalay";

export async function createSession(session: BookSession): Promise<BookSession> {
    const response = await fetch("/api/sessions", {
        method: 'POST',
        body: JSON.stringify({ ...session, createdAt: new Date() })
    })

    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

export async function removeSession(sessionId: string): Promise<BookSession> {
    const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify({ deleteAt: new Date() })
    })

    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

export async function updateSession(session: BookSession): Promise<BookSession> {
    const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...session, updatedAt: new Date() })
    })

    if (!response.ok) {
        const errorMessage = await response.text()
        throw Error(`Wrong response status: ${response.statusText} message: ${errorMessage}`)
    }

    return response.json()
}


export async function getSession(id: string): Promise<BookSession> {
    const response = await fetch("/api/sessions/" + id)

    if (!response.ok) {
        const errorMessage = await response.text()
        throw Error(`Wrong response status: ${response.statusText} message: ${errorMessage}`)
    }

    return response.json()
}

export async function getSessions(): Promise<BookSession[]> {
    const response = await fetch("/api/sessions")
    await delay(1000)
    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

