import { toast } from "react-toastify"
import { EventDTO } from "../../../types/types"
import Button from "../../../components/ui/Button"
import { useUpdateUserAddEvent, useUpdateUserRemoveEvent } from "../../../services/api/UserApiQuery"

type EventItemParams = { eventItem: EventDTO, mode: "public" | "assigned" }


const EventItem = ({ eventItem, mode = "public" }: EventItemParams) => {
    const updateUser = useUpdateUserAddEvent();
    const removeUser = useUpdateUserRemoveEvent();

    async function handleAddToMyEvents(eventId: string): Promise<void> {
        updateUser.mutate(eventId, {
            onError: () => {
                toast("Error during adding event")
            }
        })

    }

    async function handleRemoveFromMyEvents(eventId: string): Promise<void> {
        removeUser.mutate(eventId, {
            onError: () => {
                toast("Error during removing event")
            }
        })

    }

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
                        <Button onClick={() => handleAddToMyEvents(eventItem.id!)} >Add to my events</Button>
                    </div>
                }

                {mode == "assigned" &&
                    <div className="actions">
                        <Button href={`/events/${eventItem.id}`} >Show details</Button>
                        <Button onClick={() => handleRemoveFromMyEvents(eventItem.id!)} >Remove from my events</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default EventItem;