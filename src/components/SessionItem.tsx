import { useBookSesscionContext } from "../context/SessionsContext"
import { BookSession } from "../types/types"
import Button from "./Button"

type SessionItemParams = {
    session: BookSession
}


const SessionItem = ({ session }: SessionItemParams) => {
    const ctx = useBookSesscionContext()

    return (
        <div className="session-item">
            <img src={`./${session.image}`} />
            <div className="session-data">
                <h1>{session.title}</h1>
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