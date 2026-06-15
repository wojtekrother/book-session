import { jwtDecode } from "jwt-decode";
import { TokenStorage } from "./auth/TokenStorage";


import {  safeQuery } from "./HttpClientApi";
import {  likedEventsResponseSchema, UserCreateDTO, UserDTO, userLikedEventsDTO, UserLoginDTO, userProfileSchema, likedEventResponseSchema } from "../../features/user/schema/user.schema";
import { AuthResponseDTO,  } from "../../features/shared/schema/tokens.schema";
import { supabase } from "./supabase";
import {  User } from "@supabase/supabase-js";

async function getAuthUser(): Promise<User> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        throw error
    }
    return data.user;
}

async function getUserDTO(user?: User): Promise<UserDTO> {
    const userProfile = await getUserProfile();
    const userLikedEvents: userLikedEventsDTO = await getUserLikedEvents();
    if (user == null) {
        user = await getAuthUser();
    }
    const userDTO: UserDTO =
    {
        email: user.email!,
        id: user.id,
        role: userProfile.role,
        eventsIds: userLikedEvents
    }

    return userDTO;
}



async function getLoggedInUserDTO(): Promise<UserDTO | null> {
    const userId = getCurrentUserId();
    if (userId === null) {
        return null;
    }
    const userDTO = await getUserDTO()
    return userDTO;
}

async function userAddEvent(eventId: string): Promise<void> {
    if (await isUserLikedEvent(eventId)) {
        throw new Error(`User already liked this event.`)
    }

    let query = supabase.from("event_likes").insert({
        event_id: eventId,
        profile_id: getCurrentUserId()
    }).select().single();
    await safeQuery(query, likedEventResponseSchema);
    return;
}

async function userRemoveEvent(eventId: string): Promise<void> {

    if (!await isUserLikedEvent(eventId)) {
        throw new Error(`User already don't like this event`)
    }

    const { error } = await supabase.from("event_likes").delete().eq("event_id", eventId);
    if (error) {
        throw error;
    }
    return;
}


async function register(createUser: UserCreateDTO): Promise<AuthResponseDTO> {
    const storage = new TokenStorage();
    const { data: { user, session }, error } =
        await supabase.auth.signUp({ email: createUser.email, password: createUser.password });

    if (error) {
        throw error;
    }
    if (session && user) {
        storage.setAccessToken(session.access_token);
        storage.setRefreshToken(session.refresh_token);
        const userDTO = await getUserDTO(user);
        let response: AuthResponseDTO = {
            accessToken: session?.access_token,
            user: userDTO
        }
        return response;
    }

    throw new Error("Error during registration");
}

async function login(credentials: UserLoginDTO): Promise<AuthResponseDTO> {


    const storage = new TokenStorage();
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword(
        { email: credentials.email, password: credentials.password });
    if (error) {
        throw error;
    }
    if (session && user) {
        storage.setAccessToken(session.access_token);
        storage.setRefreshToken(session.refresh_token);
        const userDTO = await getUserDTO(user);
        let response: AuthResponseDTO = {
            accessToken: session?.access_token,
            user: userDTO
        }
        return response;
    }
    throw new Error("Login error")
}

async function logout(): Promise<void> {
    const storage = new TokenStorage();
    storage.reset();
}

async function getUserProfile() {
    let query = supabase.from("profiles").select("*").eq("id", getCurrentUserId()).single();
    const userProfile = await safeQuery(query, userProfileSchema)
    return userProfile;
}

async function getUserLikedEvents(): Promise<userLikedEventsDTO> {
    let query = supabase.from("event_likes").select("event_id");
    const userLikedEventsResponse = await safeQuery(query, likedEventsResponseSchema);
    return userLikedEventsResponse.map(item => item.event_id);
}

async function isUserLikedEvent(eventId: string): Promise<boolean> {
    let { data, error } = await supabase.from("event_likes").select("event_id").eq("event_id", eventId).maybeSingle();
    if (error) {
        throw error;
    }

    return data != null;
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


export const UserApi = { getLoggedInUser: getLoggedInUserDTO, userAddEvent, userRemoveEvent, register, login, logout }




