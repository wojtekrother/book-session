import { toast } from "react-toastify";
import { useUserLikeEvent } from "../../../services/api/UserApiQuery";

const useLikeEvent = (eventId: string) => {
    const userLikeEvent = useUserLikeEvent();
    const like = () => {
        userLikeEvent.mutate(eventId, {
            onError: () => {
                toast.error("Like event error. Please try again.")
            },
            onSuccess: () => {
                toast.success("Like event success.")
            }
        })
    }
    return {userLikeEvent, like} 
}

export default useLikeEvent;