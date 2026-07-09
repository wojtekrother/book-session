import Button from "../../../shared/components/ui/Button"
import { useGetLoggedInUser} from "../../../services/api/UserApiQuery"
import { EventDTO } from "../schema/event.schema"
import { EventApi } from "../../../services/api/EventApi"
import LikeButton from "../../../shared/components/ui/LikeButton"

type EventItemParams = { eventItem: EventDTO }


const EventItem = ({ eventItem }: EventItemParams) => {
    const loggedInUser = useGetLoggedInUser();

    const eventAssigned: boolean = loggedInUser.data ? loggedInUser.data.eventsIds.includes(eventItem.id!) : false
    const isOptimistic: boolean = eventItem.id == "optimisti-update";
    const image = !isOptimistic && eventItem.id ? EventApi.getEventImageTumbnail(eventItem.id) : null;

    return (
        <div className=" bg-gray-50 p-4 box-content flex flex-col" data-testid="eventItem" >
            <div className="flex">
                {!isOptimistic && <img src={`${image}`} className="h-28 border border-black/10 " />}
                <h2 className="text-xl p-2 ">{eventItem.title}</h2>

                {isOptimistic &&
                    <h1 className="text-red-500  ml-auto font-bold">NEW !!!</h1>
                }
            </div>
            <div className="flex flex-col h-full " >

                <p className="text-sm mb-4">{eventItem.summary}</p>
                {!isOptimistic &&
                    <div className="actions mt-auto self-end ">
                        <Button href={`/events/${eventItem.id}`} >Details</Button>
                        <LikeButton eventId={eventItem.id!} like={!eventAssigned} disabled={!loggedInUser.data}/>
                    </div>
                }

            </div>
        </div>
    )
}

export default EventItem;