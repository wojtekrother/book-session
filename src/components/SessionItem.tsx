import { toast } from "react-toastify"
import { useBookSessionContext } from "../context/SessionsContext"
import { BookSession } from "../types/types"
import Button from "./Button"
import { useUserContext } from "../context/UserSession"

type SessionItemParams = {
    session: BookSession
    mode: "public" | "assigned"
}


const SessionItem = ({ session, mode = "public" }: SessionItemParams) => {
    const ctx = useUserContext();

    async function handleAddToMySession(sessionId: string): Promise<void> {
        try {
            ctx.userAddSession(sessionId)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message)
            }
            toast.error("Error during adding session to my list. Please try again later.");
        }
    }

    async function handleRemoveFromMySession(sessionId: string): Promise<void> {
        try {
            ctx.userRemoveSession(sessionId)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message)
            }
            toast.error("Error during removing session from my list. Please try again later.");
        }
    }




    return (
        <div className=" bg-amber-50 p-4 box-content flex flex-col">
            <div className="flex">
                {session.imageUrl && <img src={`${session.imageUrl}`} className="h-28 " />}
                {session.image && <img src={`.${session.image}`} className="h-28  " />}
                <h1 className="text-xl p-2 ">{session.title}</h1>
            </div>
            <div  >

                <p>{session.summary}</p>
                {mode == "public" &&
                    <div className="actions">
                        <Button href={`/sessions/${session.id}`} >Show details</Button>
                        <Button onClick={() => handleAddToMySession(session.id!)} >Add to my sessions</Button>
                    </div>
                }

                {mode == "assigned" &&
                    <div className="actions">
                        <Button href={`/sessions/${session.id}`} >Show details</Button>
                        <Button onClick={() => handleRemoveFromMySession(session.id!)} >Remove from my sessions</Button>
                    </div>
                }
            </div>


        </div>
    )
}

export default SessionItem