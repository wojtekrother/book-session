import { useGetLoggedInUser } from "../../services/api/UserApiQuery";
import EventItemContainer from "../event/list/EventItemContainer";

const MyEventsPage = () => {
    const loggedUser = useGetLoggedInUser();

    return (
        <main>
            <header>
                My events
            </header>
            <article>
                List of my events id: {loggedUser.data?.eventsIds}
                <div className='grid grid-cols-2 gap-2'>
                    {loggedUser.data?.eventsIds &&
                        loggedUser.data?.eventsIds.map(eventId => {

                            return <EventItemContainer mode="assigned" eventId={eventId} key={eventId}></EventItemContainer>
                        })}
                </div>
            </article>
        </main>
    )
}

export default MyEventsPage;