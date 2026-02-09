import SessionItem from "../components/SessionItem";
import { useBookSessionContext } from "../context/SessionsContext";
import { useUserContext } from "../context/UserSession";


const MySessionsPage = () => {
    const userCtx = useUserContext();
    const sessionCtx = useBookSessionContext()

    return (
    <main id="session-page">
        <header>
            My sessions
        </header>
        <article>
            List of my sessions id: {userCtx.userSessionsIds}
            <div className='grid grid-cols-2 gap-2'>
                {userCtx.userSessionsIds && 
                    userCtx.userSessionsIds.map(id => {
                        const session = sessionCtx.getSession(id)
                        return <SessionItem mode="assigned" session={session!} key={id}></SessionItem>})}
            </div>
        </article>
    </main>
    )
}

export default MySessionsPage;