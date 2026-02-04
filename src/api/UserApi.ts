import { User } from "../types/types";
import { SessionApi } from "./SessionApi";




async function getUserById(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Get user error ${response.statusText} ${message}`)
    }

    return (await response.json()) as User;
}

async function getUserByLogin(login: string): Promise<User> {
    const response = await fetch(`/api/users?login=${login}`)
    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Get user error ${response.statusText} ${message}`)
    }
    const users: User[] = await response.json()
    if (users.length === 0) {
        throw new Error(`User not exist.`)
    }
    if (users.length > 1) {
        throw new Error(`Use login is not unique.`)
    }


    return users[0];
}

async function userAddSession(sessionId: string, userId: string): Promise<void> {
    const session = await SessionApi.getSession(sessionId);
    if (session == null) {
        throw new Error(`Session with id:${sessionId} not exist`)
    }
    const user = await getUserById(userId);
    if (user == null) {
        throw new Error(`User with id:${userId} not exist`)
    }

    if (user.sessionsId.indexOf(sessionId) > 0) {
        throw new Error(`User already have session with id:${sessionId}`)
    }

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
            modifiedAt: new Date(),
            sessionsId: [...user.sessionsId, sessionId]
        })
    })

    if (!response.ok) {
        throw Error(`Error during adding session to user. Status ${response.statusText}`)
    }
    return
}
async function userRemoveSession(sessionId: string, userId: string): Promise<void> {
    const session = await SessionApi.getSession(sessionId);
    if (session == null) {
        throw new Error(`Session with id:${sessionId} not exist`)
    }
    const user = await UserApi.getUserById(userId);

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
            modifiedAt: new Date(),
            sessionsId: [...user.sessionsId.filter(sesId => sesId != sessionId)]
        })
    })

    if (!response.ok) {
        throw Error(`Error during removing session from user. Status ${response.statusText}`)
    }
    return
}



//TODO verify and write correct
async function checkLoginAndPassword(login: string, password: string) {
    const response = await fetch(`/api/users?login=${login}`)
}


export const UserApi = { getUserById, getUserByLogin, userAddSession, userRemoveSession, checkLoginAndPassword }