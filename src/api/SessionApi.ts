import { BookSession } from "../types/types";
import { delay } from "../utils/dalay";

const API_URL = import.meta.env.VITE_API_URL;

export async function saveSession(session: BookSession): Promise<BookSession> {
    const response = await fetch("/api/sessions", {
        method: 'POST', //*GET, POST, PUT, DELETE, etc.
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
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

export async function getSessions(): Promise<BookSession[]> {
    const response = await fetch("/api/sessions" )
    await delay(3000)
    if (!response.ok) {
        throw Error(`Wrong response status: ${response.statusText}`)
    }

    return response.json()
}

