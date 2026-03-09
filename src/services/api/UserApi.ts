import { jwtDecode } from "jwt-decode";
import { TokenStorage } from "./auth/TokenStorage";
import { Tokens, UserCreateDTO, UserDTO } from "../../types/types";
import { EventApi } from "./EventApi";
import { httpClientApi } from "./HttpClientApi";

async function getUserById(id: string): Promise<UserDTO> {
    return await httpClientApi.get<UserDTO>(`/api/users/${id}`);
}

async function getUserByEmail(email: string): Promise<UserDTO> {
    const users: UserDTO[] = await httpClientApi.get<UserDTO[]>(`/api/users?email=${email}`);
    if (users.length === 0) {
        throw new Error(`User not exist.`)
    }
    if (users.length > 1) {
        throw new Error(`User email is not unique.`)
    }
    return users[0];
}


async function getLoggedInUser(): Promise<UserDTO | null> {
    const userId = getCurrentUserId();
    if (userId === null) {
        return null;
    }
    const user = await UserApi.getUserById(userId!);
    return user;
}

async function userAddEvent(eventId: string): Promise<void> {
    const event = await EventApi.getEvent(eventId);
    if (event == null) {
        throw new Error(`Event with id:${eventId} not exist`)
    }
    const userId = getCurrentUserId();
    const user = await getUserById(userId!);

    if (user.eventsIds.indexOf(eventId) > 0) {
        throw new Error(`User already have event with id:${eventId}`)
    }

    return await httpClientApi.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds, eventId]
    })
}

async function userRemoveEvent(eventId: string): Promise<void> {
    const event = await EventApi.getEvent(eventId);
    if (event == null) {
        throw new Error(`Event with id:${eventId} not exist`)
    }
    const userId = getCurrentUserId();
    const user = await UserApi.getUserById(userId!);


    return await httpClientApi.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds.filter(evId => evId != eventId)]
    })
}

async function register(user: UserCreateDTO): Promise<Tokens> {
    const storage = new TokenStorage();
    const token = await httpClientApi.post<Tokens>(`/api/register`, user);
    storage.setAccessToken(token.accessToken);
    storage.setRefreshToken(token.refreshToken);
    return token
}

async function login(email: string, password: string): Promise<Tokens> {
    const storage = new TokenStorage();
    const token = await httpClientApi.post<Tokens>(`/api/login`, { email, password });
    storage.setAccessToken(token.accessToken);
    storage.setRefreshToken(token.refreshToken);
    return token;
}

async function logout(): Promise<void> {
    const storage = new TokenStorage();
    storage.reset();
}



export function getCurrentUserId(): string | null {
    const token = localStorage.getItem("accessToken")
    if (!token) return null

    try {
        const decoded = jwtDecode<{ sub: string }>(token)
        return decoded.sub
    } catch {
        return null
    }
}


export const UserApi = { getUserById, getUserByEmail, getLoggedInUser, userAddEvent, userRemoveEvent, register, login, logout }




