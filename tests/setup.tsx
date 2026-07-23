import '@testing-library/jest-dom/vitest'
import { EventDTO } from '../src/features/event/schema/event.schema';


export const testEvents: EventDTO[] = [
    {
        id: 'id-01',
        title: 'Title 1',
        summary: 'Summary 1',
        description: "description 1",
        duration: 1,
        date: '2026-08-05',
        category:'culture',
        owner_user_id: null,
        created_at: "2026-07-01T10:00:00Z",
        updated_at: "2026-07-01T10:00:00Z",
        deleted_at: null
    },
    {
        id: 'id-02',
        title: 'Title 2',
        summary: 'Summary 2',
        description: "description 2",
        duration: 2,
        date: '2026-08-07',
        category:'entertainment',
        owner_user_id: null,
        created_at: "2026-07-01T10:00:00Z",
        updated_at: "2026-07-01T10:00:00Z",
        deleted_at: null
    },
    {
        id: 'id-03',
        title: 'Title 3',
        summary: 'Summary 3',
        description: "description 3",
        duration: 3,
        date: '2026-08-09',
        category:'science',
        owner_user_id: null,
        created_at: "2026-07-01T10:00:00Z",
        updated_at: "2026-07-01T10:00:00Z",
        deleted_at: null
    },
    {
        id: 'id-04',
        title: 'Title 4',
        summary: 'Summary 4',
        description: "description 4",
        duration: 4,
        date: '2026-08-11',
        category:'culture',
        owner_user_id: null,
        created_at: "2026-07-01T10:00:00Z",
        updated_at: "2026-07-01T10:00:00Z",
        deleted_at: null
    },
]

vi.mock("react-loader-spinner", () => ({
    Oval: () => <div />,
}));

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
