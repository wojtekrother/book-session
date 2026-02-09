import { createContext, ReactNode, useCallback, useContext, useMemo, useReducer, useRef,  } from "react"


import {  User } from "../types/types";
import { StringUtils } from "../utils/string";
import { UserApi } from "../api/UserApi";



type UserContextValue = {
    login: ({ login, password }: { login: string, password: string }) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
    userAddSession: (sessionId: string) => Promise<void>,
    userRemoveSession: (sessionId: string) => Promise<void>,
    userSessionsIds: string[] | undefined
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUserContext() {
    const context = useContext(UserContext);
    if (context == null) {
        throw Error("UserContext is null.")
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


type UserAddSessionAction = {
    type: "USER_ADD_SESSION_BY_ID",
    payload: {
        sessionId: string
    }
}

type UserRemoveSessionAction = {
    type: "USER_REMOVE_SESSION_BY_ID",
    payload: {
        sessionId: string
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

type UserActions = UserAddSessionAction | UserRemoveSessionAction | UserLoginAction | UserLogoutinAction |
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

    if (action.type === "USER_ADD_SESSION_BY_ID") {
        return { ...state, user: { ...state.user!, sessionsId: [...state.user!.sessionsId, action.payload.sessionId] } }
    }

    if (action.type === "USER_REMOVE_SESSION_BY_ID") {
        return { ...state, user: { ...state.user!, sessionsId: state.user!.sessionsId.filter(sessionId => sessionId !== action.payload.sessionId) } }
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


    const login: UserContextValue["login"] = useCallback(async ({ login, password }) => {

        if (state.user != null) {
            throw new Error("User is allready loggied in.");
        }
        if (StringUtils.isBlank(login) || StringUtils.isBlank(password)) {
            throw new Error("Login and password is reqiured");
        }
        setPendingUserStatus();
        try {
            const newUser = await UserApi.getUserByLogin(login);

            if (newUser == null || newUser.password !== password) {
                throw new Error("Invalid login or password")
            }

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

    const userAddSession: UserContextValue["userAddSession"] = useCallback(async (sessionId) => {
        if (!isLoggedIn) {
            throw new Error("User is ont logged in.")
        } else {

            setPendingUserStatus();
            try {
                await UserApi.userAddSession(sessionId, state.user?.id!)
                dispatch({ type: "USER_ADD_SESSION_BY_ID", payload: { sessionId } })
            } catch (err) {
                dispatch({ type: "USER_ERROR", payload: { message: "Error during adding sassion to user." } });
                throw err;
            }
            setIdleUserStatus();
        }
    }, [isLoggedIn, state.user]);


    const userRemoveSession: UserContextValue["userRemoveSession"] = useCallback(async (sessionId) => {
        if (!isLoggedIn) {
            throw new Error("User is ont logged in.")
        } else {
            setPendingUserStatus();
            try {
                await UserApi.userRemoveSession(sessionId, state.user?.id!)
                dispatch({ type: "USER_REMOVE_SESSION_BY_ID", payload: { sessionId } })
            } catch (err) {
                dispatch({ type: "USER_ERROR", payload: { message: "Error during removing sassion to user." } });
                throw err;
            }
            setIdleUserStatus();
        }
    }, [isLoggedIn, state.user]);
    const userSessionsIds = state.user != null ? state.user.sessionsId : undefined;


    const ctx: UserContextValue = useMemo<UserContextValue>(() => {
        return {
            login,
            logout,
            isLoggedIn,
            userAddSession,
            userRemoveSession,
            userSessionsIds
        }
    }
        , [isLoggedIn, login, logout, userAddSession, userRemoveSession, userSessionsIds]);

    return (
        <UserContext.Provider value={ctx}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider