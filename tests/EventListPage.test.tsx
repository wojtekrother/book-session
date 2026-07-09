import { screen } from "@testing-library/react";

import { renderWithProviders } from "./test-utils";
import { testEvents } from "./setup";
import { EventApi } from "../src/services/api/EventApi";
import EventsListPage from "../src/features/event/list/EventsListPage";


beforeEach(() => {
    vi.clearAllMocks();
});

vi.mock("../src/services/api/EventApi");

describe("Event List Page validation", () => {
    
    afterEach(() => {
        vi.useRealTimers();
    });

    test("List with 1 element", async () => {
        vi.useFakeTimers();
        vi.mocked(EventApi.getPaginatedEvents)
            .mockResolvedValue({
                data: [testEvents[0]],
                meta: {
                    totalCount: 1
                }
            });
        renderWithProviders(<EventsListPage />);
        await vi.advanceTimersByTimeAsync(500);
        expect(screen.queryByText("No events found.")).not.toBeInTheDocument();
        expect(screen.getAllByTestId('eventItem')).toHaveLength(1);
        expect(screen.getByText(testEvents[0].title)).toBeInTheDocument();
        
    })

    test("Empty list", async () => {
        vi.useFakeTimers();
        vi.mocked(EventApi.getPaginatedEvents)
            .mockResolvedValue({
                data: [],
                meta: {
                    totalCount: 0
                }
            });
        renderWithProviders(<EventsListPage />);
        //displayed 10 elements on firs request
        expect(screen.getAllByTestId('eventItemSkeleton')).toHaveLength(10);
        expect(EventApi.getPaginatedEvents).toHaveBeenCalled();
        // run timers for query
        await vi.advanceTimersByTimeAsync(500);
        //no items to show. and no skeleton only on data info
        expect(screen.queryAllByTestId('eventItem')).toHaveLength(0);
        expect(screen.getByText("No events found.")).toBeInTheDocument();
        expect(screen.queryAllByTestId('eventItemSkeleton')).toHaveLength(0);
    })

    test("shows skeletons while loading and error message after failed request", async () => {
        vi.useFakeTimers();
        vi.mocked(EventApi.getPaginatedEvents)
            .mockImplementation(
                () =>
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Server error")), 1000)
                    ));


        renderWithProviders(<EventsListPage />);
        //call to query and show 10 skeleton items (for first show)
        expect(EventApi.getPaginatedEvents).toHaveBeenCalled();
        expect(screen.getAllByTestId('eventItemSkeleton')).toHaveLength(10);

        //wait for more than 1000 for query
        await vi.advanceTimersByTimeAsync(2000);
        //show error from server and hide skeleton
        expect(screen.getByRole('alert')).toHaveTextContent("Server error");
        expect(screen.queryAllByTestId('eventItemSkeleton')).toHaveLength(0);
    })



})