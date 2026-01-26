import { useBookSesscionContext } from "../context/SessionsContext"
import { BookSession } from "../types/types"
import Button from "./Button"

type SessionItemParams = {
    session: BookSession
}


const SessionItem = ({ session }: SessionItemParams) => {
    const ctx = useBookSesscionContext()

    return (
        <div className=" bg-amber-100 p-4 box-content flex flex-col">
            <div className="flex">
                {session.imageUrl && <img src={`${session.imageUrl}`} className="h-28 " />}
                {session.image && <img src={`.${session.image}`} className="h-28  " />}
                <h1 className="text-2xl ">{session.title}</h1>
            </div>
            <div className="" >

                <p>{session.summary}</p>
                <div className="actions">
                    <Button href={`/sessions/${session.id}`} >Show</Button>
                    <Button onClick={() => ctx.add(session)} >Add to my sessions</Button>
                </div>
            </div>


        </div>
    )
}

export default SessionItem