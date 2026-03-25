import { jwtDecode } from "jwt-decode";
import { TokenStorage } from "./auth/TokenStorage";

import { EventApi } from "./EventApi";

import axios from "axios";
import { axiosRequest, axiosRequestSafe, httpClientApi } from "./HttpClientApi";
import { UserCreateDTO, UserDTO, UserLoginDTO, userSchema } from "../../features/user/schema/user.schema";
import { AuthResponse, authResponseSchema, Tokens, tokensSchema } from "../../features/shared/schema/tokens.schema";

async function getUserById(id: string): Promise<UserDTO> {
    const response = await axiosRequestSafe(httpClientApi.get<UserDTO>(`/api/users/${id}`), userSchema);
    return response;
}

async function getUserByEmail(email: string): Promise<UserDTO> {

    const users = await axiosRequestSafe(axios.get(`/api/users?email=${email}`), userSchema.array() );
   
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

    const response = await axiosRequest(axios.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds, eventId]
    }))
    return response;
}

async function userRemoveEvent(eventId: string): Promise<void> {
    const event = await EventApi.getEvent(eventId);
    if (event == null) {
        throw new Error(`Event with id:${eventId} not exist`)
    }
    const userId = getCurrentUserId();
    const user = await UserApi.getUserById(userId!);

    const response = axiosRequest(axios.patch<void>(`/api/users/${userId}`, {
        modifiedAt: new Date(),
        eventsIds: [...user.eventsIds.filter(evId => evId != eventId)]
    }))
    return response;
}

async function register(user: UserCreateDTO): Promise<AuthResponse> {
    const storage = new TokenStorage();
    //TODO move seting additional fields to backend
    const token =  await axiosRequestSafe(axios.post(`/api/register`, {...user, role:"User", eventsIds:[]}), authResponseSchema);
    storage.setAccessToken(token.accessToken);
    //TODO jsonserver return only accessToken
    //storage.setRefreshToken(token.refreshToken);
    return token;
}

async function login(credentials:UserLoginDTO): Promise<AuthResponse> {
    const storage = new TokenStorage();
    //TODO move seting additional fields to backend
    const response = await axiosRequestSafe(axios.post(`/api/login`, {...credentials, role:"User", eventsIds:[]}), authResponseSchema);
    storage.setAccessToken(response.accessToken);
    //TODO jsonserver return only accessToken
    //storage.setRefreshToken(token.refreshToken);
    return response;
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




