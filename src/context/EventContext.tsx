import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { Event } from "../types/types";
import { EventApi } from "../services/api/EventApi";

export type EventContextValue = {
    fetchEvents: () => Promise<void>,
    addEvent: (event: Event) => Promise<void>,
    getEvent: (id: string) => Event | null,
    removeEvent: (id: string) => Promise<void>,
    updateEvent: (event: Event) => Promise<void>,
    events: Event[] | undefined,
    status: EventContextStatus,
    errorMessage: string | null
}

const EventContext = createContext<EventContextValue | null>(null)

export type EventContextStatus = "init" | "idle" | "pending" | "error" | "success";

type ReducerState = {
    events: Event[],
    status: EventContextStatus,
    message: string | null
}

type EventErrorAction = {
    type: "EVENT_ERROR"
    payload: {
        message: string
    }
}

type EventPendingAction = {
    type: "EVENT_PENDING"
}

type EventIdleAction = {
    type: "EVENT_IDLE"
}

type EventAddAction = {
    type: "EVENT_ADD",
    payload: {
        event: Event
    }
}

type EventRemoveAction = {
    type: "EVENT_REMOVE",
    payload: {
        eventId: string
    }
}

type EventSetAction = {
    type: "EVENT_SET",
    payload: {
        events: Event[]
    }
}

type EventUpdateAction = {
    type: "EVENT_UPDATE",
    payload: {
        event: Event
    }
}
type EventActions = EventAddAction | EventRemoveAction | EventSetAction | EventUpdateAction |
    EventErrorAction | EventPendingAction | EventIdleAction


function reducerFn(state: ReducerState, action: EventActions): ReducerState {
    if (action.type === "EVENT_ERROR") {
        return { ...state, message: action.payload.message, status: "error" }
    }
    if (action.type === "EVENT_PENDING") {
        return { ...state, message: null, status: "pending" }
    }
    if (action.type === "EVENT_IDLE") {
        return { ...state, message: null, status: "idle" }
    }
    if (action.type === "EVENT_ADD") {
        return { ...state, message: null, status: "success", events: [...state.events, action.payload.event] }
    }
    if (action.type === "EVENT_REMOVE") {
        return { ...state, message: null, status: "success", events: state.events.filter(value => value.id !== action.payload.eventId) };
    }
    if (action.type === "EVENT_SET") {
        return { ...state, message: null, status: "success", events: action.payload.events }
    }
    if (action.type === "EVENT_UPDATE") {
        return { ...state, message: null, status: "success", events: [...state.events.filter(s => s.id !== action.payload.event.id), action.payload.event] }
    }
    return state;
}

export function useEventContext() {
    const context = useContext(EventContext);
    if (context === null) {
        throw Error("Event context is null.");
    }
    return context;
}



const EventProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducerFn, { events: [], status: "init", message: null })
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>()

    useEffect(() => {
        setPendingEventStatus();
        const loadEvents = async () => {
            console.log('status before fetch', state.status)
            console.log('status before fetch 1', state.status)
            try {
                console.log("Geting events")
                dispatch({ type: "EVENT_SET", payload: { events: await EventApi.getEvents() } })
            } catch (err) {
                dispatch({ type: "EVENT_ERROR", payload: { message: "Set Events error." } })
            }
            setIdleEventStatus()
        }
        loadEvents();
        console.log('status before fetch0', state.status)
        console.log("Event providere useEffect")
    }, [])

    useEffect(()=> {
console.log('new status: ', state.status)
    }, [state.status])

    const setPendingEventStatus = useCallback(() => {
        dispatch({ type: "EVENT_PENDING" })
        if (idleTimer.current != null) {
            clearTimeout(idleTimer.current)
            idleTimer.current = null;
        }
    }, [])

    const setIdleEventStatus = useCallback((time: number = 2000) => {
        if (idleTimer.current != null) {
            clearTimeout(idleTimer.current)
        }
        idleTimer.current = setTimeout(() => {
            dispatch({ type: "EVENT_IDLE" });
            idleTimer.current = null;
        }, time)
    }, [])


    const addEvent: EventContextValue["addEvent"] = useCallback(async (event) => {
        setPendingEventStatus();
        try {
            await EventApi.createEvent(event);
            dispatch({ type: "EVENT_ADD", payload: { event} })
        } catch (err) {
            dispatch({ type: "EVENT_ERROR", payload: { message: "Add event error" } })
            throw err;
        }
        setIdleEventStatus();

    }, []);
    const removeEvent: EventContextValue["removeEvent"] = useCallback(async (eventId) => {
        setPendingEventStatus();
        try {
            await EventApi.removeEvent(eventId);
            dispatch({ type: "EVENT_REMOVE", payload: { eventId: eventId } })
        } catch (err: unknown) {
            dispatch({ type: "EVENT_ERROR", payload: { message: "Error during removing event." } });
            throw err;
        }
        setIdleEventStatus();
    }, []);


    const fetchEvents: EventContextValue["fetchEvents"] = useCallback(async () => {
        setPendingEventStatus();
        try {
            const events = await EventApi.getEvents()
            dispatch({ type: "EVENT_SET", payload: { events: events } })
        } catch (err) {
            dispatch({ type: "EVENT_ERROR", payload: { message: "Error during fetching events." } });
            throw err;
        }
        setIdleEventStatus();
    }, []);

    const updateEvent: EventContextValue["updateEvent"] = useCallback(async (event: Event) => {
        setPendingEventStatus();
        try {
            await EventApi.updateEvent(event);
            dispatch({ type: "EVENT_UPDATE", payload: { event: event } })
        } catch (err) {
            dispatch({ type: "EVENT_ERROR", payload: { message: "Error during updating event." } });
            throw err;
        }
        setIdleEventStatus();

    }, []);

    const getEvent: EventContextValue["getEvent"] = useCallback((id: string) => {
        const eventIndex = state.events.findIndex((s) => s.id === id)
        return eventIndex < 0 ? null : state.events[eventIndex];
    }, [state.events]);



    const ctx: EventContextValue = useMemo<EventContextValue>(() => {
        return {
            addEvent: addEvent,
            removeEvent: removeEvent,
            fetchEvents: fetchEvents,
            updateEvent: updateEvent,
            getEvent: getEvent,
            events: state.events,
            status: state.status,
            errorMessage: state.message,


        }
    }, [state.events, state.status, state.message, addEvent, removeEvent, fetchEvents, updateEvent, getEvent])

    return (
        <EventContext.Provider value={ctx}>
            {children}
        </EventContext.Provider>
    )
}

export default EventProvider