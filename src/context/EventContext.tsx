import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { Event, EventSearchForm } from "../types/types";
import { EventApi } from "../services/api/EventApi";

export type EventContextValue = {
    fetchEvents: () => Promise<void>,
    addEvent: (event: Event) => Promise<void>,
    getEvent: (id: string) => Event | null,
    removeEvent: (id: string) => Promise<void>,
    updateEvent: (event: Event) => Promise<void>,
    search: (searchForm: EventSearchForm) => void,
    events: Event[] | undefined,
    status: EventContextStatus,
    errorMessage: string | null
}

const EventContext = createContext<EventContextValue | null>(null)

export type EventContextStatus = "init" | "idle" | "pending" | "error" | "success";

type ReducerState = {
    events: Event[],
    status: EventContextStatus,
    message: string | null,
    searchForm: EventSearchForm,
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

type EventSearchAction = {
    type: "EVENT_SEARCH",
    payload: {
        searchForm: EventSearchForm
    }
}
type EventActions = EventAddAction | EventRemoveAction | EventSetAction | EventUpdateAction |
    EventErrorAction | EventPendingAction | EventIdleAction | EventSearchAction


export function eventReducerFn(state: ReducerState, action: EventActions): ReducerState {
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
    if (action.type === "EVENT_SEARCH") {
        return { ...state, message: null, searchForm: action.payload.searchForm }
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

export type EventProviderProps = {
    children: ReactNode,
    searchFn?: EventContextValue["search"],
    fetchEventsFn?: EventContextValue["fetchEvents"],
    addEventFn?: EventContextValue["addEvent"],
    getEventFn?: EventContextValue["getEvent"],
    removeEventFn?: EventContextValue["removeEvent"],
    updateEventFn?: EventContextValue["updateEvent"]
}

export const eventReducerInitailState: ReducerState = {
    events: [],
    status: "init",
    message: null,
    searchForm: { title: "", description: "", dateOrder: "desc" }
}



const EventProvider = ({ children, searchFn, fetchEventsFn, addEventFn, getEventFn, removeEventFn, updateEventFn }: EventProviderProps) => {
    const [state, dispatch] = useReducer(eventReducerFn, eventReducerInitailState)
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>()

    useEffect(() => {
        const abort = new AbortController();
        setPendingEventStatus();
        const loadEvents = async () => {
            try {
                const events = await EventApi.getEvents(state.searchForm, abort.signal)
                dispatch({ type: "EVENT_SET", payload: { events } })
            } catch (err) {
                dispatch({ type: "EVENT_ERROR", payload: { message: "Set Events error." } })
            }
            setIdleEventStatus()
        }
        loadEvents();
        return () => {
            setIdleEventStatus();
            abort.abort();
        }

    }, [state.searchForm.title, state.searchForm.description, state.searchForm.dateOrder])


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


    const addEvent: EventContextValue["addEvent"] = addEventFn ?? useCallback(async (event) => {
        setPendingEventStatus();
        try {
            await EventApi.createEvent(event);
            dispatch({ type: "EVENT_ADD", payload: { event } })
        } catch (err) {
            dispatch({ type: "EVENT_ERROR", payload: { message: "Add event error" } })
            throw err;
        }
        setIdleEventStatus();

    }, []);
    const removeEvent: EventContextValue["removeEvent"] = removeEventFn ?? useCallback(async (eventId) => {
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


    const fetchEvents: EventContextValue["fetchEvents"] = fetchEventsFn ?? useCallback(async () => {
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

    const updateEvent: EventContextValue["updateEvent"] = updateEventFn ?? useCallback(async (event: Event) => {
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

    const getEvent: EventContextValue["getEvent"] = getEventFn ?? useCallback((id: string) => {
        const eventIndex = state.events.findIndex((s) => s.id === id)
        return eventIndex < 0 ? null : state.events[eventIndex];
    }, [state.events]);

    const search: EventContextValue["search"] = searchFn ?? useCallback((searchForm: EventSearchForm) => {
        dispatch({ type: "EVENT_SEARCH", payload: { searchForm } })
    }, []);



    const ctx: EventContextValue = useMemo<EventContextValue>(() => {
        return {
            addEvent: addEvent,
            removeEvent: removeEvent,
            fetchEvents: fetchEvents,
            updateEvent: updateEvent,
            getEvent: getEvent,
            search,
            events: state.events,
            status: state.status,
            errorMessage: state.message,
            searchForm: state.searchForm
        }
    }, [state.events, state.status, state.message, state.searchForm, search, addEvent, removeEvent, fetchEvents, updateEvent, getEvent])

    return (
        <EventContext.Provider value={ctx}>
            {children}
        </EventContext.Provider>
    )
}

export default EventProvider