import useEventSearch from "./useEventSearch";


const EventSearch = () => {
    const { setDateOrder, setDescription, setTitle, title, description, dateOrder } = useEventSearch();

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value)
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDescription(e.currentTarget.value);
    }

    function handleDateOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setDateOrder(e.currentTarget.value as "asc" | "desc");
    }

    return <>
        <div className='flex mb-4 bg-amber-50'>
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
            <p className="text-gray-600 flex flex-col m-2">
                <label className="p-1">
                    Date:&nbsp;
                    <select name="date" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleDateOrderChange} value={dateOrder} >
                        <option value="desc" >Descending</option>
                        <option value="asc" >Ascending</option>
                    </select>
                </label>
            </p>
        </div>


    </>
}

export default EventSearch;