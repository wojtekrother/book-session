
import { useGetEvent } from "../../../services/api/EventApiQuery";
import Button from "../../../shared/components/ui/Button";
import EventItem from "./EventItem";

export type EventItemContainerProps = { eventId: string, mode: "public" | "assigned" }

const EventItemContainer = ({eventId, mode}:EventItemContainerProps) => {
    const { data, error, isPending } = useGetEvent(eventId)

    if (error) {
        return <div className=" bg-gray-50 p-4 box-content flex flex-col" data-testid="eventItem">
            This event not exist, Please return to home page <Button href="/" >Home</Button>
        </div>
    } 
     if (isPending) {
        return  <div className=" bg-gray-50 p-4 box-content flex flex-col" data-testid="eventItem">
            Loading Please wait...
        </div>
     }


    return <EventItem eventItem={data} mode={mode}></EventItem>
}

export default EventItemContainer;