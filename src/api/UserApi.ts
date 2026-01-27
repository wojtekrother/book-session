import { User } from "../types/types";
import { getSession } from "./SessionApi";


export async function getUser(id: string): Promise<User> {

    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Get user error ${response.statusText} ${message}`)
    }

    return (await response.json()) as User;
}

export async function userAddSession(sessionId: string):Promise<void> {
    
    const session = await getSession(sessionId);
    if (session == null) {
        throw new Error(`Session with id:${sessionId} not exist`)
    }
    //await fetch(`/api/users/${id}`)
    return 
}



//TODO verify and write correct
export async function checkLoginAndPassword(login: string, password: string) {
    const response = await fetch(`/api/users?login=${login}`)
} 
