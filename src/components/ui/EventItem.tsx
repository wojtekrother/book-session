import { toast } from "react-toastify"
import { EventDTO } from "../../types/types"
import Button from "./Button"
import { useUpdateUserAddEvent, useUpdateUserRemoveEvent } from "../../services/api/UserApiQuery"

type EventItemParams = {
    event: EventDTO
    mode: "public" | "assigned"
}


const EventItem = ({ event, mode = "public" }: EventItemParams) => {
    const updateUser =  useUpdateUserAddEvent();
    const removeUser =  useUpdateUserRemoveEvent();

    async function handleAddToMyEvents(eventId: string): Promise<void> {
        try {
            updateUser.mutate(eventId)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message)
            }
            toast.error("Error during adding event to my list. Please try again later.");
        }
    }

    async function handleRemoveFromMyEvents(eventId: string): Promise<void> {
        try {
            removeUser.mutate(eventId)
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message)
            }
            toast.error("Error during removing event from my list. Please try again later.");
        }
    }




    return (
        <div className=" bg-amber-50 p-4 box-content flex flex-col" data-testid="eventItem">
            <div className="flex">
                {event.imageUrl && <img src={`${event.imageUrl}`} className="h-28 " />}
                {event.image && <img src={`.${event.image}`} className="h-28  " />}
                <h1 className="text-xl p-2 ">{event.title}</h1>
            </div>
            <div  >

                <p>{event.summary}</p>
                {mode == "public" &&
                    <div className="actions">
                        <Button href={`/events/${event.id}`} >Show details</Button>
                        <Button onClick={() => handleAddToMyEvents(event.id!)} >Add to my events</Button>
                    </div>
                }

                {mode == "assigned" &&
                    <div className="actions">
                        <Button href={`/events/${event.id}`} >Show details</Button>
                        <Button onClick={() => handleRemoveFromMyEvents(event.id!)} >Remove from my events</Button>
                    </div>
                }
            </div>


        </div>
    )
}

export default EventItem