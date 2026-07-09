import useLikeEvent from "../../../features/event/hooks/useLikeEvent";
import useUnlikeEvent from "../../../features/event/hooks/useUnlikeEvent";
import likeIcon from "../../../assets/like.svg";
import unlikeIcon from "../../../assets/unlike.svg";
import Button from "./Button";

export type LikeButtonProps = {
    eventId: string,
    like: boolean,
    disabled: boolean
}


const LikeButton = ({ eventId, like, disabled }: LikeButtonProps) => {
    const { userLikeEvent, like: likeFn } = useLikeEvent(eventId);
    const { userUnlikeEvent, unlike: unlikeFn } = useUnlikeEvent(eventId);

    if (like) {
        return <Button
            className="inline-flex items-center gap-2 whitespace-nowrap"
            onClick={() => likeFn()}
            disabled={userLikeEvent.isPending || disabled}>
            Like<img src={likeIcon} className="w-3.5 h-3.5" />
        </Button>
    } else {
        return <Button
            className="inline-flex items-center gap-2 whitespace-nowrap"
            onClick={() => unlikeFn()}
            disabled={userUnlikeEvent.isPending || disabled} >
            Unlike<img src={unlikeIcon} className="w-3.5 h-3.5" />
        </Button>
    }
}

export default LikeButton;