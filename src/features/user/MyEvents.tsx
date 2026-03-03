import EventItem from "../../components/ui/EventItem";
import { useEventContext } from "../../context/old/EventContext.old";
import { useUserContext } from "../../context/UserContext";


const MyEventsPage = () => {
    const userCtx = useUserContext();
    const eventCtx = useEventContext()

    return (
        <main>
            <header>
                My events
            </header>
            <article>
                List of my events id: {userCtx.userEventsIds}
                <div className='grid grid-cols-2 gap-2'>
                    {userCtx.userEventsIds &&
                        userCtx.userEventsIds.map(id => {
                            const event = eventCtx.getEvent(id)
                            return <EventItem mode="assigned" event={event!} key={id}></EventItem>
                        })}
                </div>
            </article>
        </main>
    )
}

export default MyEventsPage;