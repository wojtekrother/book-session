import { Oval } from "react-loader-spinner";
import SkeletonListItem from "./SkeletonEventListItem"

const SkeletonList = ({ itemsCount }: { itemsCount: number }) => {
    return <>
        <div className='grid md:grid-cols-2 sm:grid-cols-1 scree gap-2 relative animate-pulse'>
            {Array.from({ length: itemsCount }).map((_, index) => {
                return <SkeletonListItem key={index} />
            })}

            {/* <div className={`z-10 inset-0 absolute bg-gray-500/50 `} >
                <div role="status"
                    aria-label='loading'
                    className="mx-auto flex justify-center sticky top-32 mt-32 "
                >
                    <Oval
                        height={80}
                        width={80}
                        color="#614da9"
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="#a3a94d"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                    /></div>
            </div> */}
        </div>
    </>
}

export default SkeletonList;