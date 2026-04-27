import { MemoryRouter } from "react-router-dom"
import UserContextProvider from "../src/services/context/old/UserContext.old"
import EventProvider from "../src/services/context/old/EventContext.old"
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
