import EventItem from "../src/features/event/list/EventItem"
import { EventDTO } from "../src/features/event/schema/event.schema"
import { screen } from '@testing-library/react'
import { useGetLoggedInUser } from "../src/services/api/UserApiQuery";
import { renderWithProviders } from "./test-utils";
import useLikeEvent from "../src/features/event/hooks/useLikeEvent";
import useUnlikeEvent from "../src/features/event/hooks/useUnlikeEvent";



vi.mock("../src/services/api/UserApiQuery");
vi.mock("../src/services/api/EventApiQuery");

vi.mock("../src/features/event/hooks/useLikeEvent");
vi.mock("../src/features/event/hooks/useUnlikeEvent");


describe("Event Item validation", () => {
    const eventItem: EventDTO = {
        id: "event-id",
        title: "title",
        description: "description",
        summary: "summary",
        category: "culture",
        date: "2026-07-03",
        duration: 3,
        owner_user_id: null,
        likes_count: 0,
        created_at: "2026-07-01T10:00:00Z",
        updated_at: "2026-07-02T10:00:00Z",
        deleted_at: null
    }

    const mockedUseGetLoggedInUser = vi.mocked(useGetLoggedInUser);
    const mockedUseLikeEvent = vi.mocked(useLikeEvent);
    const mockedUseUnlikeEvent = vi.mocked(useUnlikeEvent);

    beforeEach(() => {
        vi.resetAllMocks();
        mockedUseLikeEvent.mockReturnValue({
            userLikeEvent: {
                mutate: vi.fn(),
                isPending: false,
            },
            like: vi.fn(),
        } as any);

        mockedUseUnlikeEvent.mockReturnValue({
            userUnlikeEvent: {
                mutate: vi.fn(),
                isPending: false,
            },
            unlike: vi.fn(),
        } as any);
    });


    test("contains required fields and not show not required fields", () => {
        mockedUseGetLoggedInUser.mockReturnValue({
            data: {
                id: "user-1",
                role: "admin",
                eventsIds: ["event-id2"],
                email: "test@test.pl",
                created_at: "",
                updated_at: "",
                deleted_at: null

            },
            isLoading: false,
            isError: false,
            error: null,
        } as any);
        renderWithProviders(<EventItem eventItem={eventItem} />);

        expect(screen.getByText(eventItem.title)).toBeInTheDocument();
        expect(screen.getByText(eventItem.summary)).toBeInTheDocument();

        expect(
            screen.queryByText(eventItem.description)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(eventItem.category))
            .not.toBeInTheDocument();
        expect(
            screen.queryByText("2026-07-03"))
            .not.toBeInTheDocument();
        expect(
            screen.queryByText(eventItem.duration))
            .not.toBeInTheDocument();
    })

    test("show buttons for logged in user (and unliked event)", () => {
        mockedUseGetLoggedInUser.mockReturnValue({
            data: {
                id: "user-1",
                role: "admin",
                eventsIds: ["event-id2"],
                email: "test@test.pl",
                created_at: "",
                updated_at: "",
                deleted_at: null

            },
            isLoading: false,
            isError: false,
            error: null,
        } as any);
        renderWithProviders(<EventItem eventItem={eventItem} />);

        expect(
            screen.queryByRole("button", { name: /^Unlike$/i })
        ).not.toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /^Like$/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /^Like$/i })
        ).toBeEnabled();

        expect(
            screen.getByRole("link", { name: /^Details$/i })
        ).toBeInTheDocument();
    })

    test("show buttons for logged in user (and liked event)", () => {
        mockedUseGetLoggedInUser.mockReturnValue({
            data: {
                id: "user-1",
                role: "admin",
                eventsIds: ["event-id"],
            },
            isLoading: false,
            isError: false,
            error: null,
        } as any);
        renderWithProviders(<EventItem eventItem={eventItem} />);
        expect(
            screen.queryByRole("button", { name: /^like$/i })
        ).not.toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /^unLike$/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /^unLike$/i })
        ).toBeEnabled();

        expect(
            screen.getByRole("link", { name: /^Details$/i })
        ).toBeInTheDocument();
    })

    test("disable button for pending process", () => {
        mockedUseGetLoggedInUser.mockReturnValue({
            data: {
                id: "user-1",
                role: "admin",
                eventsIds: ["event-id"],
            },
            isLoading: false,
            isError: false,
            error: null,
        } as any);

        mockedUseUnlikeEvent.mockReturnValue({
            userUnlikeEvent: {
                mutate: vi.fn(),
                isPending: true,
            },
            unlike: vi.fn(),
        } as any);
        renderWithProviders(<EventItem eventItem={eventItem} />)
        expect(
            screen.getByRole("button", { name: /^unLike$/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /^unLike$/i })
        ).not.toBeEnabled();

        expect(
            screen.queryByRole("button", { name: /^Like$/i })
        ).not.toBeInTheDocument();
    })

})