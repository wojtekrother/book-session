import { CircleHelp, FlaskConical, Palette, PartyPopper } from "lucide-react";
import { EventCategory, eventCategorySchema } from "../schema/event.schema";

export type CategoryInfoProps = {
    category: EventCategory
}

const CategoryInfo = ({ category }: CategoryInfoProps) => {
    if (category == eventCategorySchema.enum.science) {
        return <>
            <div className=" bg-blue-100 rounded-4xl p-2 flex flex-row w-min">
                <FlaskConical className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-xs text-blue-400"> Science</span>
            </div>
        </>
    }
    if (category == eventCategorySchema.enum.entertainment) {
        return <>
            <div className=" bg-orange-100 rounded-4xl p-2 flex flex-row w-min">
                <PartyPopper className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-xs text-orange-400"> Entertainment</span>
            </div>
        </>
    }

    if (category == eventCategorySchema.enum.culture) {
        return <>
            <div className=" bg-green-100 rounded-4xl p-2 flex flex-row w-min">
                <Palette className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-xs text-green-400"> Culture</span>
            </div>
        </>
    }

    if (category == eventCategorySchema.enum.uncategorized) {
        return <>
            <div className=" bg-violet-100 rounded-4xl p-2 flex flex-row w-min">
                <CircleHelp className="h-4 w-4 text-violet-400 mr-1" />
                <span className="text-xs text-violet-400"> Other</span>
            </div>
        </>
    }



}

export default CategoryInfo;