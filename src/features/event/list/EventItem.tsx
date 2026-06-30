import { toast } from "react-toastify"

import Button from "../../../shared/components/ui/Button"
import { useGetLoggedInUser, useUpdateUserAddEvent, useUpdateUserRemoveEvent } from "../../../services/api/UserApiQuery"
import { EventDTO } from "../schema/event.shema"
import { useRemoveEvent } from "../../../services/api/EventApiQuery"
import trash from "../../../assets/trash.svg";
import { EventApi } from "../../../services/api/EventApi"

type EventItemParams = { eventItem: EventDTO, mode: "public" | "assigned" }


const EventItem = ({ eventItem, mode = "public" }: EventItemParams) => {
    const assignEventToUser = useUpdateUserAddEvent();
    const unassignEventFromUser = useUpdateUserRemoveEvent();
    const removeEvent = useRemoveEvent()
    const loggedInUser = useGetLoggedInUser();

    async function handleAddToMyEvents(eventId: string): Promise<void> {
        assignEventToUser.mutate(eventId, {
            onError: () => {
                toast.error("Like event error. Please try again.")
            },
            onSuccess: () => {
                toast.success("Like event success.")
            }
        })

    }

    async function handleRemoveFromMyEvents(eventId: string): Promise<void> {
        unassignEventFromUser.mutate(eventId, {
            onError: () => {
                toast.error("Dislike event error. Please try again.")
            },
            onSuccess: () => {
                toast.success("Dislike success.")
            }
        })
    }

    async function handleRemoveEvent(eventId: string): Promise<void> {
        const result = confirm("Are you sure to remove this Event?");
        if (result) {
            removeEvent.mutate(eventId, {
                onError: () => {
                    toast.error("Error during removing event")
                },
                onSuccess: () => {
                    toast.success("Successfuly removed event")
                }
            })
        }

    }

    

    const eventAssigned: boolean = loggedInUser.data ? loggedInUser.data.eventsIds.includes(eventItem.id!) : false
    const isOptimistic: boolean = eventItem.id == "optimisti-update";
    const image = !isOptimistic && eventItem.id ? EventApi.getEventImageTumbnail(eventItem.id) : null


    return (
        <div className=" bg-gray-50 p-4 box-content flex flex-col" data-testid="eventItem" >
            <div className="flex">
                {!isOptimistic && <img src={`${image}`} className="h-28 border border-black/10 " />}
                <h2 className="text-xl p-2 ">{eventItem.title}</h2>

                {isOptimistic &&
                    <h1 className="text-red-500  ml-auto font-bold">NEW !!!</h1>
                }
            </div>
            <div  >

                <p className="text-sm">{eventItem.summary}</p>
                {mode == "public" && !isOptimistic &&
                    <div className="actions">
                        <Button href={`/events/${eventItem.id}`} >Details</Button>
                        {(eventAssigned && loggedInUser.data ) &&
                            <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} disabled={unassignEventFromUser.isPending} >Don't Like</Button>
                        }
                        {(!eventAssigned && loggedInUser.data ) &&
                            <Button onClick={() => handleAddToMyEvents(eventItem.id!)} disabled={assignEventToUser.isPending}>Like</Button>
                        }
                        {!eventItem.deleted_at && loggedInUser.data  &&
                            <Button className="px-1 py-1 bg-transparent" onClick={() => handleRemoveEvent(eventItem.id!)} disabled={removeEvent.isPending}>
                                <img src={trash} alt="trash" className="w-5" />
                            </Button>
                        }
                    </div>

                }

                {mode == "assigned" && !isOptimistic &&
                    <div className="actions">
                        <Button href={`/events/${eventItem.id}`} >Details</Button>
                        <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} disabled={unassignEventFromUser.isPending} >Don't Like</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default EventItem;