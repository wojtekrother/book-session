import EventSearch from "./EventSearch";
import EventsList from "./EventsList";
import useEventSearchInputs from "./useEventSearchInputs";

export default function EventsListPage() {
    const eventSearch = useEventSearchInputs();


    return <>
        <main >
            <header className='mb-4 '>
                <h2 className='text-2xl mx-auto w-min text-nowrap'>Available Events</h2>
                <p>
                    Many aviable events for you. Look and choose the best.
                </p>
            </header>
            <EventSearch {...eventSearch} />


            <div id='content'>
                {eventSearch.searchQuery.isPending && <div role="status" aria-label='loading'>Loading...</div>}
                {eventSearch.searchQuery.isError && <div role="alert">{eventSearch.searchQuery.error.message}</div>}
                {!eventSearch.searchQuery.isPending &&
                    <EventsList events={eventSearch.searchQuery.data ?? []} />}

            </div>
        </main>

    </>

}