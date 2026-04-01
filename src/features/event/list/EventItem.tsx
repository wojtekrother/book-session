import { toast } from "react-toastify"

import Button from "../../../components/ui/Button"
import { useGetLoggedInUser, useUpdateUserAddEvent, useUpdateUserRemoveEvent } from "../../../services/api/UserApiQuery"
import { EventDTO } from "../schema/event.shema"

type EventItemParams = { eventItem: EventDTO, mode: "public" | "assigned" }


const EventItem = ({ eventItem, mode = "public" }: EventItemParams) => {
    const updateUser = useUpdateUserAddEvent();
    const removeUser = useUpdateUserRemoveEvent();
    const loggedInUser = useGetLoggedInUser();

    async function handleAddToMyEvents(eventId: string): Promise<void> {
        updateUser.mutate(eventId, {
            onError: () => {
                toast.error("Error during adding event")
            },
            onSuccess: () => {
                toast.success("Successfuly added event")
            }
        })

    }

    async function handleRemoveFromMyEvents(eventId: string): Promise<void> {
        removeUser.mutate(eventId, {
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
        <div className=" bg-amber-50 p-4 box-content flex flex-col" data-testid="eventItem">
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
                            <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} disabled={removeUser.isPending} >Remove from my events</Button>
                        }
                        {!eventAssigned &&
                            <Button onClick={() => handleAddToMyEvents(eventItem.id!)} disabled={updateUser.isPending}>Add to my events</Button>
                        }
                    </div>
                }

                {mode == "assigned" &&
                    <div className="actions">
                        <Button href={`/events/${eventItem.id}`} >Show details</Button>
                        <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} disabled={removeUser.isPending} >Remove from my events</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default EventItem;