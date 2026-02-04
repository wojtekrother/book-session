import { createContext, ReactNode, useCallback, useContext, useMemo, useReducer, useState } from "react"
import { toast } from "react-toastify";

import { BookSession, User } from "../types/types";
import { StringUtils } from "../utils/string";
import { UserApi } from "../api/UserApi";
import { useBookSessionContext } from "./SessionsContext";


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

type UserReducerState = {
    user: User | null
}

function reducerFn(state: UserReducerState, action: UserAddSessionAction | UserRemoveSessionAction | UserLoginAction | UserLogoutinAction): UserReducerState {


    if (action.type === "USER_ADD_SESSION_BY_ID") {
        return { user: { ...state.user!, sessionsId: [...state.user!.sessionsId, action.payload.sessionId] } }
    }

    if (action.type === "USER_REMOVE_SESSION_BY_ID") {
        return { user: { ...state.user!, sessionsId: state.user!.sessionsId.filter(sessionId => sessionId !== action.payload.sessionId) } }
    }
    if (action.type === "USER_LOGIN") {
        return { user: action.payload.user }
    }
    if (action.type === "USER_LOGOUT") {
        return { user: null }
    }




    return state;
}


const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [state, dispatch] = useReducer(reducerFn, { user: null })




    const login: UserContextValue["login"] = async ({ login, password }) => {
        if (state.user != null) {
            throw new Error("User is allready loggied in.");
        }
        if (StringUtils.isBlank(login) || StringUtils.isBlank(password)) {
            throw new Error("Login and password is reqiured");
        }

        const newUser = await UserApi.getUserByLogin(login);

        if (newUser == null || newUser.password !== password) {
            throw new Error("Invalid login or password")
        }

        dispatch({ type: "USER_LOGIN", payload: { user: newUser } })
    }

    const logout: UserContextValue["logout"] = () => {
        if (state.user == null) {
            throw new Error("User is allredy logged out.");
        }
        dispatch({ type: "USER_LOGOUT" })
    }

    const isLoggedIn: UserContextValue["isLoggedIn"] = state.user != null;




    const userAddSession: UserContextValue["userAddSession"] = useCallback(async (sessionId) => {
        if (!isLoggedIn) {
            throw new Error("User is ont logged in.")
        } else {

            try {
                await UserApi.userAddSession(sessionId, state.user?.id!)
                dispatch({ type: "USER_ADD_SESSION_BY_ID", payload: { sessionId } })
            } catch (err) {
                throw err;
            }
        }
    }, [isLoggedIn, state.user?.id!])
    const userRemoveSession: UserContextValue["userRemoveSession"] = useCallback(async (sessionId) => {
        try {
            await userRemoveSession(sessionId)
            dispatch({ type: "USER_REMOVE_SESSION_BY_ID", payload: { sessionId } })
        } catch (err) {
            throw err;
        }
    }, []);
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