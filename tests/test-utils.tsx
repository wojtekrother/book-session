import { MemoryRouter } from "react-router-dom"
import UserContextProvider from "../src/context/UserContext"
import EventProvider from "../src/context/EventContext"
import { render, renderHook } from "@testing-library/react"
import React, { ReactElement } from "react"

const providers = ({ children }: { children: React.ReactNode }) => (
  <React.StrictMode>
    <MemoryRouter>
      <UserContextProvider>
        <EventProvider>{children}</EventProvider>
      </UserContextProvider>
    </MemoryRouter>
  </React.StrictMode>
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
