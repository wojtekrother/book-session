
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { logRoles, screen } from '@testing-library/react'
import { EVENTS } from '../src/dummy-events'
import EventsListPage from '../src/features/event/EventsList'
import { renderWithProviders } from './test-utils'


const server = setupServer(
  http.get('/api/events', () => {
    return HttpResponse.json(EVENTS)
  }),
  http.get("/api/events/1", () => {
    return HttpResponse.json(EVENTS[0])
  })

)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("", () => {
  test('loads and displays loading end events', async () => {
    renderWithProviders(<EventsListPage />)
    logRoles(document.body)
    expect(await screen.findByRole('status', { name: /loading/i })).toBeInTheDocument();

    expect(await screen.findAllByTestId('eventItem')).toHaveLength(10);
    expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
  })



  test.skip('loads error and display error', async () => {
    server.use(
      http.get('/events', () => {
        return HttpResponse.error()
      })
    )
    renderWithProviders(<EventsListPage />)
    expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('eventItem')).toHaveLength(0)
    expect(await screen.findByRole('alert')).toBeInTheDocument();

  })
})