import { Context, createContext, ReactNode, useContext, useReducer } from "react";
import { BookSession } from "../types/types";
import { userAddSession } from "../api/UserApi";

type BookSessionContextValue = {
    sessions: BookSession[]
    add: (session: BookSession) => Promise<void>,
    remove: (id: string) => Promise<void>,
}

const BookSessionContext = createContext<BookSessionContextValue | null>(null)

type reducerState = {
    sessions: BookSession[]
}

type AddSessionAction = {
    type: "ADD_SESSION",
    payload: {
        session: BookSession
    }
}

type RemoveSessionAction = {
    type: "REMOVE_SESSION",
    payload: {
        id: string
    }
}


function reducerFn(state: reducerState, action: AddSessionAction | RemoveSessionAction): reducerState {
    if (action.type === "ADD_SESSION") {

        return { sessions: [...state.sessions, action.payload.session] };
    }

    if (action.type === "REMOVE_SESSION") {
        return { sessions: state.sessions.filter(value => value.id !== action.payload.id) };
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
        async add(session) {
            try {
                await userAddSession("ddds")
                dispatch({ type: "ADD_SESSION", payload: { session } })
                console.log("Add session")
            } catch (err) {
                throw err;
            }

        },
        async remove(id) {
            dispatch({ type: "REMOVE_SESSION", payload: { id } })
        },
    }

    return (
        <BookSessionContext.Provider value={ctx}>
            {children}
        </BookSessionContext.Provider>
    )
}

export default BookSessionProvider