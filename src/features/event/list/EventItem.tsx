import { toast } from "react-toastify"

import Button from "../../../components/ui/Button"
import { useGetLoggedInUser, useUpdateUserAddEvent, useUpdateUserRemoveEvent } from "../../../services/api/UserApiQuery"
import { EventDTO } from "../schema/event.shema"
import { useRemoveEvent } from "../../../services/api/EventApiQuery"

type EventItemParams = { eventItem: EventDTO, mode: "public" | "assigned" }


const EventItem = ({ eventItem, mode = "public" }: EventItemParams) => {
    const assignEventToUser = useUpdateUserAddEvent();
    const unassignEventFromUser = useUpdateUserRemoveEvent();
    const removeEvent = useRemoveEvent()
    const loggedInUser = useGetLoggedInUser();

    async function handleAddToMyEvents(eventId: string): Promise<void> {
        assignEventToUser.mutate(eventId, {
            onError: () => {
                toast.error("Error during assignig event")
            },
            onSuccess: () => {
                toast.success("Successfuly assigned event")
            }
        })

    }

    async function handleRemoveFromMyEvents(eventId: string): Promise<void> {
        unassignEventFromUser.mutate(eventId, {
            onError: () => {
                toast.error("Error during unassigning event")
            },
            onSuccess: () => {
                toast.success("Successfuly unassigned event")
            }
        })
    }

    async function handleRemoveEvent(eventId: string): Promise<void> {
        removeEvent.mutate(eventId, {
            onError: () => {
                toast.error("Error during removing event")
            },
            onSuccess: () => {
                toast.success("Successfuly removed event")
            }
        })
    }



    const eventAssigned: boolean = loggedInUser.data ? loggedInUser.data.eventsIds.includes(eventItem.id!) : false

    return (
        <div className=" bg-amber-50 p-4 box-content flex flex-col" data-testid="eventItem" >
            <div className="flex">
                {eventItem.imageUrl && <img src={`${eventItem.imageUrl}`} className="h-28 " />}
                {eventItem.image && <img src={`.${eventItem.image}`} className="h-28  " />}
                <h1 className="text-xl p-2 ">{eventItem.title}</h1>
            </div>
            <div  >

                <p>{eventItem.summary}</p>
                {mode == "public" &&
                    <div className="actions">
                        <Button href={`/events/${eventItem.id}`} >Show details</Button>
                        {eventAssigned &&
                            <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} disabled={unassignEventFromUser.isPending} >Remove from my events</Button>
                        }
                        {!eventAssigned &&
                            <Button onClick={() => handleAddToMyEvents(eventItem.id!)} disabled={assignEventToUser.isPending}>Add to my events</Button>
                        }
                        {!eventItem.deleteAt &&
                            <Button className="bg-red-500"  onClick={() => handleRemoveEvent(eventItem.id!)} disabled={removeEvent.isPending}>Remove</Button>
                        }
                    </div>

                }

                {mode == "assigned" &&
                    <div className="actions">
                        <Button href={`/events/${eventItem.id}`} >Show details</Button>
                        <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} disabled={unassignEventFromUser.isPending} >Remove from my events</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default EventItem;