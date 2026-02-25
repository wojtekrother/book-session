import { createContext, ReactNode, useCallback, useContext, useMemo, useReducer, useRef,  } from "react"


import {  AccessToken, User } from "../types/types";
import { StringUtils } from "../utils/string";
import { UserApi } from "../services/api/UserApi";



type UserContextValue = {
    login: ({ email, password }: { email: string, password: string }) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
    userAddEvent: (eventId: string) => Promise<void>,
    userRemoveEvent: (eventId: string) => Promise<void>,
    userEventsIds: string[] | undefined
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUserContext() {
    const context = useContext(UserContext);
    if (context == null) {
        throw new Error("UserContext is null.")
    }
    return context;
}

type UserContextProviderProps = {
    children: ReactNode
}

type UserErrorAction = {
    type: "USER_ERROR"
    payload: {
        message: string
    }
}

type UserPendingAction = {
    type: "USER_PENDING"
}

type UserIdleAction = {
    type: "USER_IDLE"
}


type UserAddEventAction = {
    type: "USER_ADD_EVENT_BY_ID",
    payload: {
        eventId: string
    }
}

type UserRemoveEventAction = {
    type: "USER_REMOVE_EVENT_BY_ID",
    payload: {
        eventId: string
    }
}

type UserLoginAction = {
    type: "USER_LOGIN",
    payload: {
        user: User
    }
}

type UserLogoutinAction = {
    type: "USER_LOGOUT"
}
export type UserContextStatus = "init" | "idle" | "pending" | "error" | "success";

type UserReducerState = {
    user: User | null,
    status: UserContextStatus,
    message: string | null
}

type UserActions = UserAddEventAction | UserRemoveEventAction | UserLoginAction | UserLogoutinAction |
    UserErrorAction | UserPendingAction | UserIdleAction

function reducerFn(state: UserReducerState, action: UserActions): UserReducerState {
    if (action.type === "USER_ERROR") {
        return { ...state, message: action.payload.message, status: "error" }
    }
    if (action.type === "USER_PENDING") {
        return { ...state, message: null, status: "pending" }
    }
    if (action.type === "USER_IDLE") {
        return { ...state, message: null, status: "idle" }
    }
    if (action.type === "USER_ADD_EVENT_BY_ID") {
        return { ...state, user: { ...state.user!, eventsIds: [...state.user!.eventsIds, action.payload.eventId] } }
    }
    if (action.type === "USER_REMOVE_EVENT_BY_ID") {
        return { ...state, user: { ...state.user!, eventsIds: state.user!.eventsIds.filter(eventId => eventId !== action.payload.eventId) } }
    }
    if (action.type === "USER_LOGIN") {
        return { ...state, user: action.payload.user }
    }
    if (action.type === "USER_LOGOUT") {
        return { ...state, user: null }
    }

    return state;
}


const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [state, dispatch] = useReducer(reducerFn, { user: null, message: null, status: "init" })
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>()


    const setPendingUserStatus = useCallback(() => {
        dispatch({ type: "USER_PENDING" })
        if (idleTimer.current != null) {
            clearTimeout(idleTimer.current)
            idleTimer.current = null;
        }
    }, [])

    const setIdleUserStatus = useCallback((time: number = 2000) => {
        if (idleTimer.current != null) {
            clearTimeout(idleTimer.current)
        }
        idleTimer.current = setTimeout(() => {
            dispatch({ type: "USER_IDLE" });
            idleTimer.current = null;
        }, time)
    }, [])


    const login: UserContextValue["login"] = useCallback(async ({ email, password }) => {

        if (state.user != null) {
            throw new Error("User is allready loggied in.");
        }
        if (StringUtils.isBlank(email) || StringUtils.isBlank(password)) {
            throw new Error("Login and password is reqiured");
        }
        setPendingUserStatus();
        try {
            await UserApi.login(email, password)
            const newUser = await UserApi.getUserByEmail(email);
            dispatch({ type: "USER_LOGIN", payload: { user: newUser } })
        } catch (err) {
            dispatch({ type: "USER_ERROR", payload: { message: "Error during login." } });
            throw err;
        }
        setIdleUserStatus();
    }, [state.user])

    const logout: UserContextValue["logout"] = useCallback(() => {
        dispatch({ type: "USER_LOGOUT" })
    }, [])

    const isLoggedIn: UserContextValue["isLoggedIn"] = state.user != null;

    const userAddEvent: UserContextValue["userAddEvent"] = useCallback(async (eventId) => {
        if (!isLoggedIn) {
            throw new Error("User is ont logged in.")
        } else {

            setPendingUserStatus();
            try {
                await UserApi.userAddEvent(eventId, state.user?.id!)
                dispatch({ type: "USER_ADD_EVENT_BY_ID", payload: { eventId: eventId } })
            } catch (err) {
                dispatch({ type: "USER_ERROR", payload: { message: "Error during adding sassion to user." } });
                throw err;
            }
            setIdleUserStatus();
        }
    }, [isLoggedIn, state.user]);


    const userRemoveEvent: UserContextValue["userRemoveEvent"] = useCallback(async (eventId) => {
        if (!isLoggedIn) {
            throw new Error("User is ont logged in.")
        } else {
            setPendingUserStatus();
            try {
                await UserApi.userRemoveEvent(eventId, state.user?.id!)
                dispatch({ type: "USER_REMOVE_EVENT_BY_ID", payload: { eventId } })
            } catch (err) {
                dispatch({ type: "USER_ERROR", payload: { message: "Error during removing event from user." } });
                throw err;
            }
            setIdleUserStatus();
        }
    }, [isLoggedIn, state.user]);
    const userEventsIds = state.user != null ? state.user.eventsIds : undefined;


    const ctx: UserContextValue = useMemo<UserContextValue>(() => {
        return {
            login,
            logout,
            isLoggedIn,
            userAddEvent: userAddEvent,
            userRemoveEvent: userRemoveEvent,
            userEventsIds: userEventsIds
        }
    }
        , [isLoggedIn, login, logout, userAddEvent, userRemoveEvent, userEventsIds]);

    return (
        <UserContext.Provider value={ctx}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider