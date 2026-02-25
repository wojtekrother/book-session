import { eventReducerFn, eventReducerInitailState } from "../src/context/EventContext"
import { testEvents } from "./setup"


describe("Event context reducer tests", () => {

    test("add event", () => {
        const state = eventReducerFn(eventReducerInitailState, { type: "EVENT_ADD", payload: { event: testEvents[0] } })
        expect(state.events).toHaveLength(1);
        expect(state.events).equal(testEvents[0]);
    })

    test("set events", () => {
        const state = eventReducerFn(eventReducerInitailState, { type: "EVENT_SET", payload: { events: testEvents } })
        expect(state.events).toHaveLength(testEvents.length);
        expect(state.events).equal(testEvents);
    })

    test("remove event", () => {
        let state = eventReducerFn(eventReducerInitailState, { type: "EVENT_SET", payload: { events: testEvents } })
        state = eventReducerFn(state, { type: "EVENT_REMOVE", payload: { eventId: testEvents[0].id!} })
        expect(state.events).toHaveLength(testEvents.length - 1);
        expect(state.events.find((e) => {e.id === testEvents[0].id})).toBeUndefined();
    })

    test("update event", () => {
        let state = eventReducerFn(eventReducerInitailState, { type: "EVENT_SET", payload: { events: testEvents } })
        state = eventReducerFn(state, { type: "EVENT_UPDATE", payload: { event: {...testEvents[0], title: "new title"}}})
        expect(state.events).toHaveLength(testEvents.length);
        expect(state.events.find((e) => {e.id === testEvents[0].id})).toEqual({...testEvents[0], title: "new title"});
    })


})