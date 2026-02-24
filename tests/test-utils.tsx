import { MemoryRouter } from "react-router-dom"
import UserContextProvider from "../src/context/UserContext"
import EventProvider from "../src/context/EventContext"
import { render, renderHook } from "@testing-library/react"
import { ReactElement } from "react"

const providers = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <UserContextProvider>
      <EventProvider>{children}</EventProvider>
    </UserContextProvider>
  </MemoryRouter>
);

export const renderWithProviders = (ui: ReactElement) => {
  return render(ui, {
    wrapper: providers
  })
}


export const renderHookWithProviders = <T,>(hook: () => T) => {
  return renderHook(hook, {
    wrapper: providers
  })
}
