import SkeletonListItem from "./SkeletonListItem"

const SkeletonList = ({ itemsCount }: { itemsCount: number }) => {
    return <>
        {Array.from({ length: itemsCount }).map((_, index) => {
            return <SkeletonListItem key={index} />
        })}
    </>
}

export default SkeletonList;