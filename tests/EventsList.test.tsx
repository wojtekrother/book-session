
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { logRoles, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
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
  test('display status loading and show elements', async () => {
    server.use(
      http.get('/api/events', async () => {
        await delay(500);
        return HttpResponse.json(EVENTS.splice(0, 3));
      })
    )

    renderWithProviders(<EventsListPage />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    await waitForElementToBeRemoved(screen.getByRole('status', { name: /loading/i }))
    expect(await screen.findAllByTestId('eventItem')).toHaveLength(3);
    expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
  })



  test('loads error and display error', async () => {
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.error()
      })
    )
    renderWithProviders(<EventsListPage />)
    expect(screen.queryAllByTestId('eventItem')).toHaveLength(0)
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  })
})