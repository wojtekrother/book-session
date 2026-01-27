import { BookSession } from "../types/types";
import { delay } from "../utils/dalay";

export async function saveSession(session: BookSession): Promise<BookSession> {
    const response = await fetch("/api/sessions", {
        method: 'POST',
        body: JSON.stringify(session) 
    })

    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
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
    const response = await fetch("/api/sessions" )
    await delay(1000)
    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

