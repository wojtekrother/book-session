
import SkeletonListItem from "./SkeletonEventListItem"

const SkeletonList = ({ itemsCount }: { itemsCount: number }) => {
    return <>
        <div className='grid md:grid-cols-2 sm:grid-cols-1 scree gap-2 relative animate-pulse'>
            {Array.from({ length: itemsCount }).map((_, index) => {
                return <SkeletonListItem key={index} />
            })}
        </div>
    </>
}

export default SkeletonList;