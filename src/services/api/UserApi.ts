import { User } from "../../types/types";
import { EventApi } from "./EventApi";




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

async function userAddEvent(eventId: string, userId: string): Promise<void> {
    const event = await EventApi.getEvent(eventId);
    if (event == null) {
        throw new Error(`Event with id:${eventId} not exist`)
    }
    const user = await getUserById(userId);
    if (user == null) {
        throw new Error(`User with id:${userId} not exist`)
    }

    if (user.eventsIds.indexOf(eventId) > 0) {
        throw new Error(`User already have event with id:${eventId}`)
    }

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            modifiedAt: new Date(),
            eventsIds: [...user.eventsIds, eventId]
        })
    })

    if (!response.ok) {
        throw Error(`Error during adding event to user. Status ${response.statusText}`)
    }
    return
}
async function userRemoveEvent(eventId: string, userId: string): Promise<void> {
    const event = await EventApi.getEvent(eventId);
    if (event == null) {
        throw new Error(`Event with id:${eventId} not exist`)
    }
    const user = await UserApi.getUserById(userId);

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            modifiedAt: new Date(),
            eventsIds: [...user.eventsIds.filter(evId => evId != eventId)]
        })
    })

    if (!response.ok) {
        throw Error(`Error during removing event from user. Status ${response.statusText}`)
    }
    return
}



//TODO verify and write correct
async function checkLoginAndPassword(login: string, password: string) {
    const response = await fetch(`/api/users?login=${login}`)
}


export const UserApi = { getUserById, getUserByLogin, userAddEvent, userRemoveEvent, checkLoginAndPassword }