import { useEventSearchInputsResult } from "../hooks/useEventSearchInputs";
import { EventCategory, eventCategorySchema } from "../schema/event.schema";
import { eventSearchDateOrderEnum, EventSearchDateOrderEnum } from "../schema/eventSearch.schema";

export type EventSearchParams = Omit<useEventSearchInputsResult, "searchQuery">

const EventSearch = ({ setDateOrder, setDescription, setTitle, setCategories,
    title, description, categories, dateOrder }: EventSearchParams) => {

     
    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDescription(e.currentTarget.value);
    }

    function handleCategoriesChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.currentTarget.value == "") {
            setCategories([])
        } else {
            setCategories([e.currentTarget.value as EventCategory])
        }
    }

    function handleDateOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setDateOrder(e.currentTarget.value as EventSearchDateOrderEnum);
    }


    return <>
        <div className='flex mb-4 bg-gray-50'>
            <p className="text-gray-600 flex flex-col m-2 ">
                <label className="p-1">
                    Title:&nbsp;
                    <input name="title" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleTitleChange} value={title} />
                </label>
            </p>
            <p className="text-gray-600 flex flex-col m-2 ">
                <label className="p-1">
                    Description:&nbsp;
                    <input name="description" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleDescriptionChange} value={description} />
                </label>
            </p>
            <p className="text-gray-600 flex flex-col m-2 ">
                <label className="p-1">
                    Categories:&nbsp;
                    <select name="categories" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleCategoriesChange} value={categories[0] ?? ""}  >
                        <option value="" >All</option>
                        <option value={eventCategorySchema.enum.science} >Science</option>
                        <option value={eventCategorySchema.enum.culture} >Culture</option>
                        <option value={eventCategorySchema.enum.entertainment}>Entertainment</option>
                        <option value={eventCategorySchema.enum.uncategorized} >Other</option>
                    </select>
                </label>
            </p>
            <p className="text-gray-600 flex flex-col m-2">
                <label className="p-1">
                    Date:&nbsp;
                    <select name="date" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleDateOrderChange} value={dateOrder} >
                        <option value={eventSearchDateOrderEnum.enum.desc} >Descending</option>
                        <option value={eventSearchDateOrderEnum.enum.asc} >Ascending</option>
                    </select>
                </label>
            </p>
        </div>


    </>
}

export default EventSearch;