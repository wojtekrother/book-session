import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useEventContext } from "../../context/EventContext";
import debounce from 'lodash/debounce'


const EventSearch = () => {
    const eventCtx = useEventContext();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");
    const defferedTitle = useDeferredValue(title);
    const defferedDescritpion = useDeferredValue(description);
    const defferedDateOrder = useDeferredValue(dateOrder);

    const debouncedSearchFn = useMemo(() =>
        debounce((title, description, dateOrder) => {
            console.log("search debounce ")
            eventCtx.search({ title, description, date: dateOrder })
        }, 1000), [])

    useEffect(() => {
        console.log("effect")
        debouncedSearchFn(defferedTitle, defferedDescritpion, defferedDateOrder);
        return () => {
            console.log("search debounce cancel")
            debouncedSearchFn.cancel()
        }
    }, [defferedTitle, defferedDescritpion, defferedDateOrder, debouncedSearchFn])


    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const tit = e.currentTarget.value
        setTitle(tit)
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        const desc = e.currentTarget.value;
        setDescription(desc);
    }

    function handleDateOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const orderDate = e.currentTarget.value as "asc" | "desc";
        setDateOrder(orderDate);
    }

    return <>
        <div className='flex mb-4 bg-amber-50'>
            <p className="text-gray-600 flex flex-col m-2 ">
                <label htmlFor="title" className="p-1">
                    Title:&nbsp;
                    <input name="title" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleTitleChange} value={title} />
                </label>
            </p>
            <p className="text-gray-600 flex flex-col m-2 ">
                <label htmlFor="description" className="p-1">
                    Description:&nbsp;
                    <input name="description" className="py-1 px-2 text-gray-700 border border-blue-600 rounded-xl "
                        onChange={handleDescriptionChange} value={description} />

                </label>
            </p>
            <p className="text-gray-600 flex flex-col m-2">
                <label htmlFor="date" className="p-1">
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