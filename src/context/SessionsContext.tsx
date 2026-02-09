import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { BookSession } from "../types/types";
import { SessionApi } from "../api/SessionApi";

export type BookSessionContextValue = {
    fetchSessions: () => Promise<void>,
    addSession: (session: BookSession) => Promise<void>,
    getSession: (id: string) => BookSession | null,
    removeSession: (id: string) => Promise<void>,
    updateSession: (session: BookSession) => Promise<void>,
    sessions: BookSession[] | undefined,
    status: BookSessionContextStatus,
    errorMessage: string | null
}

const BookSessionContext = createContext<BookSessionContextValue | null>(null)

export type BookSessionContextStatus = "init" | "idle" | "pending" | "error" | "success";

type ReducerState = {
    sessions: BookSession[],
    status: BookSessionContextStatus,
    message: string | null
}

type SessionErrorAction = {
    type: "SESSION_ERROR"
    payload: {
        message: string
    }
}

type SessionPendingAction = {
    type: "SESSION_PENDING"
}

type SessionIdleAction = {
    type: "SESSION_IDLE"
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

type SessionUpdateAction = {
    type: "SESSION_UPDATE",
    payload: {
        session: BookSession
    }
}
type SessionActions = SessionAddAction | SessionRemoveAction | SessionSetAction | SessionUpdateAction |
    SessionErrorAction | SessionPendingAction | SessionIdleAction


function reducerFn(state: ReducerState, action: SessionActions): ReducerState {
    if (action.type === "SESSION_ERROR") {
        return { ...state, message: action.payload.message, status: "error" }
    }
    if (action.type === "SESSION_PENDING") {
        return { ...state, message: null, status: "pending" }
    }
    if (action.type === "SESSION_IDLE") {
        return { ...state, message: null, status: "idle" }
    }
    if (action.type === "SESSION_ADD") {
        return { ...state, message: null, status: "success", sessions: [...state.sessions, action.payload.session] }
    }
    if (action.type === "SESSION_REMOVE") {
        return { ...state, message: null, status: "success", sessions: state.sessions.filter(value => value.id !== action.payload.sessionId) };
    }
    if (action.type === "SESSION_SET") {
        return { ...state, message: null, status: "success", sessions: action.payload.sessions }
    }
    if (action.type === "SESSION_UPDATE") {
        return { ...state, message: null, status: "success", sessions: [...state.sessions.filter(s => s.id !== action.payload.session.id), action.payload.session] }
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
    const [state, dispatch] = useReducer(reducerFn, { sessions: [], status: "init", message: null })
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>()

    useEffect(() => {
        const loadSessions = async () => {
            setPendingSessionStatus();
            try {
                dispatch({ type: "SESSION_SET", payload: { sessions: await SessionApi.getSessions() } })
            } catch (err) {
                dispatch({ type: "SESSION_ERROR", payload: { message: "Add session error" } })
                throw err;
            }
            setIdleSessionStatus()

        }
        loadSessions()
    }, [])

    const setPendingSessionStatus = useCallback(() => {
        dispatch({ type: "SESSION_PENDING" })
        if (idleTimer.current != null) {
            clearTimeout(idleTimer.current)
            idleTimer.current = null;
        }
    }, [])

    const setIdleSessionStatus = useCallback((time: number = 2000) => {
        if (idleTimer.current != null) {
            clearTimeout(idleTimer.current)
        }
        idleTimer.current = setTimeout(() => {
            dispatch({ type: "SESSION_IDLE" });
            idleTimer.current = null;
        }, time)
    }, [])


    const addSession: BookSessionContextValue["addSession"] = useCallback(async (session) => {
        setPendingSessionStatus();
        try {
            await SessionApi.createSession(session);
            dispatch({ type: "SESSION_ADD", payload: { session } })
        } catch (err) {
            dispatch({ type: "SESSION_ERROR", payload: { message: "Add session error" } })
            throw err;
        }
        setIdleSessionStatus();

    }, []);
    const removeSession: BookSessionContextValue["removeSession"] = useCallback(async (sessionId) => {
        setPendingSessionStatus();
        try {
            await SessionApi.removeSession(sessionId);
            dispatch({ type: "SESSION_REMOVE", payload: { sessionId } })
        } catch (err: unknown) {
            dispatch({ type: "SESSION_ERROR", payload: { message: "Error during removing session." } });
            throw err;
        }
        setIdleSessionStatus();
    }, []);


    const fetchSessions: BookSessionContextValue["fetchSessions"] = useCallback(async () => {
        setPendingSessionStatus();
        try {
            const sessions = await SessionApi.getSessions()
            dispatch({ type: "SESSION_SET", payload: { sessions } })
        } catch (err) {
            dispatch({ type: "SESSION_ERROR", payload: { message: "Error during fetching sessions." } });
            throw err;
        }
        setIdleSessionStatus();
    }, []);

    const updateSession: BookSessionContextValue["updateSession"] = useCallback(async (session: BookSession) => {
        setPendingSessionStatus();
        try {
            await SessionApi.updateSession(session);
            dispatch({ type: "SESSION_UPDATE", payload: { session } })
        } catch (err) {
            dispatch({ type: "SESSION_ERROR", payload: { message: "Error during updating session." } });
            throw err;
        }
        setIdleSessionStatus();

    }, []);

    const getSession: BookSessionContextValue["getSession"] = useCallback((id: string) => {
        const sessionIndex = state.sessions.findIndex((s) => s.id === id)
        return sessionIndex < 0 ? null : state.sessions[sessionIndex];
    }, [state.sessions]);



    const ctx: BookSessionContextValue = useMemo<BookSessionContextValue>(() => {
        return {
            addSession,
            removeSession,
            fetchSessions,
            updateSession,
            getSession,
            sessions: state.sessions,
            status: state.status,
            errorMessage: state.message,


        }
    }, [state.sessions, state.status, state.message, addSession, removeSession, fetchSessions, updateSession, getSession])

    return (
        <BookSessionContext.Provider value={ctx}>
            {children}
        </BookSessionContext.Provider>
    )
}

export default BookSessionProvider