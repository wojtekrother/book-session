import { useBookSessionContext } from "../context/SessionsContext";
import { useUserContext } from "../context/UserSession";


const MySessions = () => {
    const userCtx = useUserContext();
    const sessionCtx = useBookSessionContext()

    return (
    <main id="session-page">
        <header>
            My sessions
        </header>
        <article>
            List of my sessions
            <ul>
                {userCtx.userSessionsIds && }
            </ul>
        </article>
    </main>
    )
}

export default MySessions;