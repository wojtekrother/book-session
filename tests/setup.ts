import '@testing-library/jest-dom/vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { EVENTS } from '../src/dummy-events'
import { Event } from '../src/types/types'


export const server = setupServer(
    http.get('/api/events', ({ request }) => {
        const url = new URL(request.url);
        const sortDate = url.searchParams.get("_order");
        const description = url.searchParams.get("description");
        const title = url.searchParams.get("title");
        let result = testEvents;
        if (title) {
            result = result.filter(e => e.title === title)
        }
        if (description) {
            result = result.filter(e => e.description === description)
        }

        if (sortDate === "asc") {
            result = result.sort((e1, e2)=> +e1.date.replace("-", "") - +e2.date.replace("-", ""))
        } else {
            result = result.sort((e1, e2)=>  +e2.date.replace("-", "") - +e1.date.replace("-", ""))
        }
        return HttpResponse.json(result);
    }),
    http.get("/api/events/e01", () => {
        return HttpResponse.json(testEvents[0]);
    })

)

export const testEvents: Event[] = [
    {
        id: 'e01',
        title: 'Title 1',
        summary: 'Summary 1',
        description: "description 1",
        duration: 1,
        date: '2023-11-05',
        image: undefined,
    },
    {
        id: 'e02',
        title: 'Title 2',
        summary: "Summary 2",
        description: "Description 2",
        duration: 2,
        date: '2023-11-03',
        image: undefined,
    },
    {
        id: 'e03',
        title: 'Title 3',
        summary: 'Summary 3',
        description: "Description 3",
        duration: 1.5,
        date: '2023-11-01',
        image: undefined,
    },
]




beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())