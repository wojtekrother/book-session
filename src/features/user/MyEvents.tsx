import { useGetLoggedInUser } from "../../services/api/UserApiQuery";
import EventItemContainer from "../event/list/EventItemContainer";

const MyEventsPage = () => {
    const loggedUser = useGetLoggedInUser();

    return (
        <main>
            <header className='mb-4 '>
                <h2 className='text-2xl mx-auto w-min text-nowrap'>Events liked by you.</h2>
                <p className="mx-auto w-max align-middle">
                    Your favourte events in one place.
                </p>
            </header>
            <article>
               
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