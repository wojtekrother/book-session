import { screen } from "@testing-library/react";
import EventsList from "../src/features/event/list/EventsList";
import { renderWithProviders } from "./test-utils";
import { testEvents } from "./setup";

describe("Event List validation", () => {

    test("Show info for no events", () => {
        renderWithProviders(<EventsList events={[]} />);
        expect(screen.getByText("No events found.")).toBeInTheDocument();
    })

    test("Show all provided elements", async () => {
        renderWithProviders(<EventsList events={testEvents} />);
        expect(await screen.findAllByTestId('eventItem')).toHaveLength(testEvents.length);
        expect(screen.queryByText("No events found.")).not.toBeInTheDocument();
    })

})