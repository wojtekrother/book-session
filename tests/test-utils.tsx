import { MemoryRouter } from "react-router-dom"
import UserContextProvider from "../src/context/UserContext"
import EventProvider from "../src/context/EventContext"
import { render } from "@testing-library/react"
import { ReactElement } from "react"

export const renderWithProviders = (ui: ReactElement) => {
    return render(ui, {
      wrapper: ({ children }) => (
        <MemoryRouter>
        <UserContextProvider>
          <EventProvider>{children}</EventProvider>
        </UserContextProvider>
        </MemoryRouter>
      ),
    })
  }