import EventSearch from "./EventSearch";
import EventsList from "./EventsList";
import useEventSearchInputsInfinite from "../hooks/useEventSearchInputsInfinite";
import SkeletonList from "./skeleton/SkeletonEventList";
import { useEffect} from "react";

export default function EventsListPage() {
    const eventSearch = useEventSearchInputsInfinite();

    const { searchQueryInfinite: searchQuery } = eventSearch;

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting &&
                    searchQuery.hasNextPage &&
                    !searchQuery.isFetchingNextPage) {
                    searchQuery.fetchNextPage();
                }
            });
        });

        const loadMoreSectionElement = document.getElementById("loadMoreSectionElement")
        if (loadMoreSectionElement) {
            observer.observe(loadMoreSectionElement);
        }
        return () => {
            observer.disconnect();
        }
    }, [searchQuery.fetchNextPage, searchQuery.hasNextPage, searchQuery.isFetchingNextPage])

    const isInitialLoading = !searchQuery.data && searchQuery.isFetching;

    //clalc how many element will be loaded on next page 
    const loadedPagesCount = searchQuery?.data?.pages.length ?? 0;
    const availableElementToLoad = searchQuery?.data?.pages?.[0].meta.totalCount ?? 0
    const toLoadOnNextPage = isInitialLoading ? 10 : Math.min(availableElementToLoad - loadedPagesCount * 10, 10)



    return <>
        <main >
            <header className='mb-4 '>
                <h2 className='text-2xl mx-auto w-min text-nowrap'>Available Events</h2>
                <p className="mx-auto">
                    Many aviable events for you. Look and choose the best.
                </p>
            </header>
            <EventSearch {...eventSearch} />

            <div id='content' className="min-h-96 relative">
                {searchQuery.isError && <div role="alert">{searchQuery.error.message}</div>}
                {searchQuery.data &&
                    <>
                        <EventsList events={searchQuery.data.pages.map((item) => item.data).flat() ?? []} />
                        {searchQuery.hasNextPage &&
                            <div id="loadMoreSectionElement" className="h-5"></div>
                        }
                    </>
                }
                {(isInitialLoading || searchQuery.isFetchingNextPage || searchQuery.isLoading) &&
                    <SkeletonList itemsCount={toLoadOnNextPage}></SkeletonList>
                }
                {(searchQuery.status === "success" && toLoadOnNextPage === 0) &&
                    <p className="mx-auto"> No more data to load </p>
                }
            </div>
        </main>
    </>
}