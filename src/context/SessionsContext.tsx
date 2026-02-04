import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { BookSession } from "../types/types";
import { SessionApi } from "../api/SessionApi";

export type BookSessionContextValue = {
    setSessions: (sessions: BookSession[]) => Promise<void>,
    addSsession: (session: BookSession) => Promise<void>,
    removeSession: (id: string) => Promise<void>,
    //   updateSession: (sesion: BookSession) => Promise<void>
    sessions: BookSession[] | undefined
}

const BookSessionContext = createContext<BookSessionContextValue | null>(null)

type ReducerState = {
    sessions?: BookSession[]
}

type SessionAddAction = {
    type: "SESSION_ADD",
    payload: {
        session: BookSession
    }
}

type SessionRemoveAction = {
    type: "SESSION_REMOVE",
    payload: {
        sessionId: string
    }
}

type SessionSetAction = {
    type: "SESSION_SET",
    payload: {
        sessions: BookSession[]
    }
}


function reducerFn(state: ReducerState, action: SessionAddAction | SessionRemoveAction | SessionSetAction): ReducerState {
    if (action.type === "SESSION_ADD") {

        return { ...state, sessions: [...state.sessions!, action.payload.session] };
    }

    if (action.type === "SESSION_REMOVE") {

        return { ...state, sessions: state.sessions!.filter(value => value.id !== action.payload.sessionId) };
    }
    if (action.type === "SESSION_SET") {
        return { sessions: action.payload.sessions }
    }
    return state;
}

export function useBookSessionContext() {
    const context = useContext(BookSessionContext);
    if (context === null) {
        throw Error("Book session context is null.");
    }
    return context;
}



const BookSessionProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducerFn, { sessions: undefined })

    useEffect(() => {
        const loadSessions = async () => {
            console.log("Ładowanie sesji 1")
            dispatch({ type: "SESSION_SET", payload: { sessions: await SessionApi.getSessions() } })
            console.log("Ładowanie sesji 2")
        }
        loadSessions()
    },[])

    const addSsession: BookSessionContextValue["addSsession"] = useCallback(async (session) => {
        try {
            if (state.sessions === undefined) {
                throw new Error("Sessions not loaded. Please wait.");
            }
            await SessionApi.createSession(session);
            dispatch({ type: "SESSION_ADD", payload: { session } })
        } catch (err) {
            throw err;
        }

    }, []);
    const removeSession: BookSessionContextValue["removeSession"] = useCallback(async (sessionId) => {
        if (state.sessions === undefined) {
            throw new Error("Sessions not loaded. Please wait.");
        }
        await SessionApi.removeSession(sessionId);
        dispatch({ type: "SESSION_REMOVE", payload: { sessionId } })
    }, []);
    const setSessions: BookSessionContextValue["setSessions"] = useCallback(async (sessions: BookSession[]) => {
        if (state.sessions !== null) {
            throw new Error("Sessions not loaded. Please wait.");
        }

        dispatch({ type: "SESSION_SET", payload: { sessions } })
        return


    }, []);

    const ctx: BookSessionContextValue = useMemo<BookSessionContextValue>(() => {
        return {
            addSsession, removeSession, setSessions,

            sessions: state.sessions

        }
    }, [state.sessions, addSsession, removeSession, setSessions])

    return (
        <BookSessionContext.Provider value={ctx}>
            {children}
        </BookSessionContext.Provider>
    )
}

export default BookSessionProvider