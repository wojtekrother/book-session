import { AccessTokenStorage } from "../../actions/AccesTokenStorage";
import { AccessToken, User } from "../../types/types";
import { EventApi } from "./EventApi";
import { httpClientApi } from "./HttpClientApi";

async function getUserById(id: string): Promise<User> {
    return await httpClientApi.get<User>(`/api/users/${id}`);
}

async function getUserByEmail(email: string): Promise<User> {
    const users: User[] = await httpClientApi.get<User[]>(`/api/users?email=${email}`);
    if (users.length === 0) {
        throw new Error(`User not exist.`)
    }
    if (users.length > 1) {
        throw new Error(`User email is not unique.`)
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

    return await httpClientApi.patch<void>(`/api/users/${userId}`, {
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


    return await httpClientApi.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds.filter(evId => evId != eventId)]
    })
}

async function register(user: User): Promise<AccessToken> {
    const storage = new AccessTokenStorage();
    const token = await httpClientApi.post<AccessToken>(`/api/register`, user);
    storage.set(token.accessToken);
    return token
}

async function login(email: string, password: string): Promise<AccessToken> {
    const storage = new AccessTokenStorage();
    const token = await httpClientApi.post<AccessToken>(`/api/login`, { email, password });
    storage.set(token.accessToken);
    return token;
}






export const UserApi = { getUserById, getUserByEmail, userAddEvent, userRemoveEvent, register, login }




