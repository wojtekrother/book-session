import EventSearch from "./EventSearch";
import EventsList from "./EventsList";
import useEventSearchInputsInfinite from "../hooks/useEventSearchInputsInfinite";
import SkeletonList from "./skeleton/SkeletonEventList";

export default function EventsListPage() {
    const eventSearch = useEventSearchInputsInfinite();
    const { searchQueryInfinite: searchQuery } = eventSearch;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                searchQuery.fetchNextPage();
            }
        });
    });

    const loadMoreSectionElement = document.getElementById('loadMoreSection');
    if (loadMoreSectionElement) {
        observer.observe(loadMoreSectionElement);
    }
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
                {searchQuery.isError && <div role="alert">{searchQuery.error.message}</div>}
                {searchQuery.data &&
                    <>
                        <EventsList events={searchQuery.data.pages.flat() ?? []} />

                        {searchQuery.hasNextPage &&
                            <>
                                <div id="loadMoreSection" className="h-5"></div>
                            </>
                        }
                    </>
                }
                {searchQuery.isFetching &&
                    <>
                        <SkeletonList itemsCount={10}></SkeletonList>

                    </>
                }
                {searchQuery.status === "success" && !searchQuery.hasNextPage && <p> No more data to load </p>}
            </div>
        </main>
    </>
}