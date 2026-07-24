import Button from "../../../shared/components/ui/Button"
import { useGetLoggedInUser } from "../../../services/api/UserApiQuery"
import { EventDTO } from "../schema/event.schema"
import { EventApi } from "../../../services/api/EventApi"
import LikeButton from "../../../shared/components/ui/LikeButton"
import { Heart, Star } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { useState } from "react"
import CategoryInfo from "../shared/CategoryInfo"

type EventItemParams = { eventItem: EventDTO }


const EventItem = ({ eventItem }: EventItemParams) => {
    const loggedInUser = useGetLoggedInUser();
    const [imageError, setImageError] = useState<boolean>(false);

    const isLiked: boolean = loggedInUser.data ? loggedInUser.data.eventsIds.includes(eventItem.id!) : false
    const isOptimistic: boolean = eventItem.id == "optimisti-update";
    const isOwner = loggedInUser.data ? eventItem.owner_user_id == loggedInUser.data.id : false;
    const image = !isOptimistic && eventItem.id ? EventApi.getEventImageTumbnail(eventItem.id) : null;


    return (
        <div className=" bg-gray-50 p-4 box-content flex flex-col" data-testid="eventItem" >
            <div className="flex">
                <div className="flex h-28 w-42 shrink-0 border border-gray-400 items-center justify-center">
                    {!imageError && image &&
                        <img
                            src={`${image}`}
                            className="h-full w-full object-cover  "
                            onError={() => setImageError(true)} />
                    }
                    {imageError &&
                        <>
                            <ImageIcon
                                aria-hidden="true"
                                className="h-20 w-20 text-gray-400"
                                strokeWidth={1.5} />
                            <span className="sr-only">No photo to show</span>
                        </>
                    }
                </div>
                <div className="flex-1 p-2 ">
                    <div className="flex items-center">
                        <CategoryInfo category={eventItem.category} />
                        <div className="ml-auto flex items-center gap-3">
                            {isOptimistic &&
                                <h1 className="text-red-500  ml-auto font-bold">NEW !!!</h1>
                            }
                            {isOwner &&
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            }
                            <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                                <span className="text-xs">{eventItem.likes_count}</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl ">
                        {eventItem.title}



                    </h2>
                </div>
            </div>
            <div className="flex flex-col h-full " >

                <p className="text-sm mb-4">{eventItem.summary}</p>
                {!isOptimistic &&
                    <div className="actions mt-auto self-end ">
                        <Button href={`/events/${eventItem.id}`} >Details</Button>

                        <LikeButton eventId={eventItem.id!} like={!isLiked} disabled={!loggedInUser.data} />
                    </div>
                }

            </div>
        </div>
    )
}

export default EventItem;