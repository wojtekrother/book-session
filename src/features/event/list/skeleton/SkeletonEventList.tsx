import SkeletonListItem from "./SkeletonEventListItem"

const SkeletonList = ({ itemsCount }: { itemsCount: number }) => {
    return <>
        {Array.from({ length: itemsCount }).map((_, index) => {
            return <SkeletonListItem key={index} />
        })}
    </>
}

export default SkeletonList;