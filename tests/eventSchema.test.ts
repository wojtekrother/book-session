import { EventDTO, eventSchema } from "../src/features/event/schema/event.schema"

describe("Zod validation", () => {

    test("validates correct event", () => {
        const input: EventDTO = {
            id: "123",
            category: "entertainment",
            date: new Date(),
            description: "descriotion",
            duration: 1,
            summary: "sum",
            title: "title",
            created_at: "test",
            updated_at: "test",
            deleted_at: "2026-07-01T10:00:00Z"
        };

        const result = eventSchema.parse(input);
        expect(result).toEqual(input);
    })

    test("rejects invalid field values", () => {
        const input: EventDTO = {
            id: "123",
            category: "entertainment",
            date: new Date(),
            description: "d",//too short
            duration: 1,
            summary: "s",//too short
            title: "1234567890_1234567890_1234567890_1234567890_1234567890_1234567890_",//too long
            created_at: "test",
            updated_at: "test",
            deleted_at: null
        };

        const result = eventSchema.safeParse(input);
        expect(result.success).toBe(false);
    })

    test("rejects missing required fields", () => {
        const input = {
            id: "123",
            category: "entertainment",
            date: new Date(),
            description: "description",
            duration: 1,
            title: "1234567890",
            created_at: "test",
            updated_at: "test",
            deleted_at: null
        };
        //missing summary 
        expect(() => {
            eventSchema.parse(input);
        }).toThrow();

    })

})