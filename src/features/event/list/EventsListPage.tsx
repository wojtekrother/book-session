import { Oval } from "react-loader-spinner";
import EventSearch from "./EventSearch";
import EventsList from "./EventsList";
import useEventSearchInputs from "../hooks/useEventSearchInputs";
import SkeletonList from "./skeleton/SkeletonEventList";

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


            <div id='content' className="min-h-96 relative">


                {eventSearch.searchQuery.isError && <div role="alert">{eventSearch.searchQuery.error.message}</div>}


{/* {!eventSearch.searchQuery.data &&
                    <EventsList events={[]} skeleton={true} />}

                    <SkeletonList itemsCount={4}   />
 <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-20 w-full animate-pulse rounded bg-gray-300"
        />
      ))}
    </div> */}
                {eventSearch.searchQuery.data &&
                    <>
                        <EventsList events={eventSearch.searchQuery.data ?? []} skeleton={true}/>

                        {!eventSearch.searchQuery.isFetching &&
                            <div className={`z-10 inset-0 absolute bg-gray-500/50 `} >
                                <div role="status"
                                    aria-label='loading'
                                    className="mx-auto flex justify-center sticky top-32 mt-32 "
                                >
                                    <Oval
                                        height={80}
                                        width={80}
                                        color="#614da9"
                                        visible={true}
                                        ariaLabel="oval-loading"
                                        secondaryColor="#a3a94d"
                                        strokeWidth={2}
                                        strokeWidthSecondary={2}
                                    /></div>
                            </div>}
                    </>
                }

                

            </div>
        </main>

    </>

}