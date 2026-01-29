import { Context, createContext, ReactNode, useContext, useReducer } from "react";
import { BookSession, User } from "../types/types";
import { userAddSession, userRemoveSession } from "../api/UserApi";
import { createSession, getSession, removeSession } from "../api/SessionApi";

type BookSessionContextValue = {
    sessions: BookSession[]
    user?: User,
    sessionAdd: (session: BookSession) => Promise<void>,
    sessionRemove: (id: string) => Promise<void>,
    userAddSession: (sessionId: string) => Promise<void>,
    userRemoveSession: (sessionId: string) => Promise<void>,
}

const BookSessionContext = createContext<BookSessionContextValue | null>(null)

type ReducerState = {
    sessions: BookSession[]
    user?: User
}

type SessionAddAction = {
    type: "SESSION_ADD",
    payload: {
        session: BookSession
    }
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

type SessionRemoveAction = {
    type: "SESSION_REMOVE",
    payload: {
        sessionId: string
    }
}


function reducerFn(state: ReducerState, action: SessionAddAction | SessionRemoveAction | UserAddSessionAction | UserRemoveSessionAction): ReducerState {
    if (action.type === "SESSION_ADD") {
        return {...state, sessions: [...state.sessions, action.payload.session] };
    }

    if (action.type === "SESSION_REMOVE") {
        return {...state, sessions: state.sessions.filter(value => value.id !== action.payload.sessionId) };
    }

    if (action.type === "USER_ADD_SESSION_BY_ID") {
        return {...state, user: {...state.user!, sessionsId:[...state.user!.sessionsId, action.payload.sessionId]}}
    }

    if (action.type === "USER_REMOVE_SESSION_BY_ID") {
        return {...state, user: {...state.user!, sessionsId: state.user!.sessionsId.filter(sessionId => sessionId !== action.payload.sessionId)}}
    }




    return state;
}

export function useBookSesscionContext() {
    const context = useContext(BookSessionContext);
    if (context === null) {
        throw Error("Book session context is null.");
    }
    return context;
}



const BookSessionProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducerFn, { sessions: [] })


    let ctx: BookSessionContextValue = {
        sessions: state.sessions,
        async sessionAdd(session) {
            try {
                await createSession(session);
                dispatch({ type: "SESSION_ADD", payload: { session } })
            } catch (err) {
                throw err;
            }

        },
        async sessionRemove(sessionId) {
            await removeSession(sessionId);
            dispatch({ type: "SESSION_REMOVE", payload: {sessionId } })
        },
        async userAddSession(sessionId) {
            try {
                await userAddSession(sessionId, userId)
                dispatch({ type: "USER_ADD_SESSION_BY_ID", payload: { sessionId } })
            } catch (err) {
                throw err;
            }
        },
        async userRemoveSession(sessionId) {
            try {
                await userRemoveSession(sessionId)
                dispatch({ type: "USER_REMOVE_SESSION_BY_ID", payload: { sessionId } })
            } catch (err) {
                throw err;
            }
        },
        
    }

    return (
        <BookSessionContext.Provider value={ctx}>
            {children}
        </BookSessionContext.Provider>
    )
}

export default BookSessionProvider