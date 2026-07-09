import { toast } from "react-toastify";
import { useUserUnlikeEvent } from "../../../services/api/UserApiQuery";

const useUnlikeEvent = (eventId: string) => {
    const userUnlikeEvent = useUserUnlikeEvent();
    const unlike = () => {
        userUnlikeEvent.mutate(eventId, {
            onError: () => {
                    toast.error("Unlike event error. Please try again.")
                },
            onSuccess: () => {
                toast.success("Unlike success.")
            }
        })
    }
    return {userUnlikeEvent, unlike};
}

export default useUnlikeEvent;