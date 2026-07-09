import { MemoryRouter } from "react-router-dom"

import { render, renderHook } from "@testing-library/react"
import React, { ReactElement } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";






const providers = ({ children }: { children: React.ReactNode }) => {
  
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
  // return <React.StrictMode>
  //   <MemoryRouter>
  //     <QueryClientProvider client={queryClient}>
  //       {children}
  //     </QueryClientProvider>
  //   </MemoryRouter>
  // </React.StrictMode>

   return  <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </MemoryRouter>
};

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
