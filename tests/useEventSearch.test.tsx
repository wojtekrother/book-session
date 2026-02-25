import { renderHook } from "@testing-library/react"
import { act } from "react"


import useEventSearch from "../src/features/event/useEventSearchInputs"
import { MemoryRouter } from "react-router-dom"
import UserContextProvider from "../src/context/UserContext"
import EventProvider from "../src/context/EventContext"
describe("Test useEventSearch hook", () => {

    test("Debounce test", () => {
        const searchMock = vi.fn()
        const providersWithMock = ({ children }: { children: React.ReactNode }) => (
            <MemoryRouter>
                <UserContextProvider>
                    <EventProvider searchFn={searchMock} >{children}</EventProvider>
                </UserContextProvider>
            </MemoryRouter>
        );

        vi.useFakeTimers();
        const { result } = renderHook(() => useEventSearch(), { wrapper: providersWithMock })
        act(() => {
            result.current.setTitle("value1")
        })
        act(() => {
            vi.advanceTimersByTime(250);
        })

        expect(searchMock).not.toBeCalled();
        act(() => {
            result.current.setTitle("value2")
            result.current.setDescription("value3")
        })
        act(() => {
            vi.advanceTimersByTime(250);
        })
        expect(searchMock).not.toBeCalled();
        act(() => {
            vi.advanceTimersByTime(250);
        })
        expect(searchMock).toBeCalledTimes(1);
        expect(searchMock).toBeCalledWith({title:"value2", description:"value3", dateOrder:"desc"})
        vi.useRealTimers();

    })
})