import { User } from "../../types/types";
import { EventApi } from "./EventApi";
import { HttpClientApi } from "./HttpClient";

async function getUserById(id: string): Promise<User> {
    return await HttpClientApi.get<User>(`/api/users/${id}`);
}

async function getUserByLogin(login: string): Promise<User> {
    const users: User[] = await HttpClientApi.get<User[]>(`/api/users?login=${login}`);
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

    return await HttpClientApi.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds, eventId]
    })
}
async function userRemoveEvent(eventId: string, userId: string): Promise<void> {
    const event = await EventApi.getEvent(eventId);
    if (event == null) {
        throw new Error(`Event with id:${eventId} not exist`)
    }
    const user = await UserApi.getUserById(userId);


    return await HttpClientApi.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds.filter(evId => evId != eventId)]
    })

}



//TODO verify and write correct
async function checkLoginAndPassword(login: string, password: string) {
    const response = await fetch(`/api/users?login=${login}`)
}


export const UserApi = { getUserById, getUserByLogin, userAddEvent, userRemoveEvent, checkLoginAndPassword }




