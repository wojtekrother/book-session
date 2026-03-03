import userEvent from "@testing-library/user-event"
import EventSearch from "../src/features/event/EventSearch"

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from "react-router-dom"
import UserContextProvider from "../src/context/UserContext"
import EventProvider from "../src/context/old/EventContext.old"
import React from "react"

describe("Event search component test", () => {
    const searchMock = vi.fn()

    const providersWithMock = ({ children }: { children: React.ReactNode }) => (
        <React.StrictMode>
            <MemoryRouter>
                <UserContextProvider>
                    <EventProvider searchFn={searchMock}
                        fetchEventsFn={vi.fn().mockResolvedValue([])}
                        addEventFn={vi.fn()}
                        removeEventFn={vi.fn()}
                        updateEventFn={vi.fn()} >{children}</EventProvider>
                </UserContextProvider>
            </MemoryRouter>
        </React.StrictMode>
    );
    beforeEach(() => {
        searchMock.mockReset();
    })

    const setup = () => {
        render(<EventSearch />, { wrapper: providersWithMock });
        return userEvent.setup();
    }

    test("Check default values", () => {
        setup();
        const titleInput = screen.getByRole("textbox", { name: /title/i });
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveValue("");

        const descriptionInput = screen.getByRole("textbox", { name: /description/i });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("");

        const dateSelect = screen.getByRole("combobox", { name: /date/i });
        expect(dateSelect).toBeInTheDocument();
        expect(dateSelect).toHaveValue("desc");
        expect(screen.getAllByRole("option")).toHaveLength(2)
    })

    test("Check input and select can chancge values", async () => {
        const user = setup();

        const titleInput = screen.getByRole("textbox", { name: /title/i });
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveValue("");
        await user.type(titleInput, "test1");
        expect(titleInput).toHaveValue("test1");

        const descriptionInput = screen.getByRole("textbox", { name: /description/i });
        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("");
        await user.type(descriptionInput, "test2");
        expect(descriptionInput).toHaveValue("test2");

        const dateSelect = screen.getByRole("combobox", { name: /date/i });
        expect(dateSelect).toBeInTheDocument();
        expect(dateSelect).toHaveValue("desc");
        await user.selectOptions(dateSelect, "asc")
        expect(dateSelect).toHaveValue("asc");
    })

    test("changes in inputs run search", async () => {
        const user = setup()

        const titleInput = screen.getByRole("textbox", { name: /title/i });
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveValue("");
        expect(searchMock).not.toBeCalled();

        await user.type(titleInput, "test1");
        await user.type(screen.getByRole("textbox", { name: /description/i }), "test2");
        expect(searchMock).not.toBeCalled();
        await waitFor(() => {
            expect(searchMock).toBeCalledTimes(1)
            expect(searchMock).toBeCalledWith({ title: "test1", description: "test2", dateOrder: "desc" })
        })

    })

    test("changes in select run search", async () => {
        const user = setup()

        expect(searchMock).not.toBeCalled();
        await user.selectOptions(screen.getByRole("combobox", { name: /date/i }), "asc");
        await waitFor(() => {
            expect(searchMock).toBeCalledTimes(1)
            expect(searchMock).toBeCalledWith({ title: "", description: "", dateOrder: "asc" })
        })

    })


    test("clear input start search", async () => {
        const user = setup()
        const titleInput = screen.getByRole("textbox", { name: /title/i });
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveValue("");
        expect(searchMock).not.toBeCalled();
        await user.type(titleInput, "test1");
        expect(searchMock).not.toBeCalled();
        await waitFor(() => {
            expect(searchMock).toHaveBeenLastCalledWith({ title: "test1", description: "", dateOrder: "desc" });
        }, {timeout:500})
        await user.clear(titleInput);
        await waitFor(() => {
            expect(searchMock).toHaveBeenLastCalledWith({ title: "", description: "", dateOrder: "desc" });
        })

    })

    test("not run search after render", async () => {
        setup()
        render(<EventSearch />, { wrapper: providersWithMock });
        await new Promise(resolved => setTimeout(resolved, 600))
        expect(searchMock).toBeCalledTimes(2);
    })
})