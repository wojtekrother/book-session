import { toast } from "react-toastify"
import { useBookSessionContext } from "../context/SessionsContext"
import { BookSession } from "../types/types"
import Button from "./Button"
import { useUserContext } from "../context/UserSession"

type SessionItemParams = {
    session: BookSession
}


const SessionItem = ({ session }: SessionItemParams) => {
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


    return (
        <div className=" bg-amber-50 p-4 box-content flex flex-col">
            <div className="flex">
                {session.imageUrl && <img src={`${session.imageUrl}`} className="h-28 " />}
                {session.image && <img src={`.${session.image}`} className="h-28  " />}
                <h1 className="text-xl p-2 ">{session.title}</h1>
            </div>
            <div  >

                <p>{session.summary}</p>
                <div className="action">
                    <Button href={`/sessions/${session.id}`} >Show</Button>
                    <Button onClick={() => handleAddToMySession(session.id!)} >Add to my sessions</Button>
                </div>
            </div>


        </div>
    )
}

export default SessionItem