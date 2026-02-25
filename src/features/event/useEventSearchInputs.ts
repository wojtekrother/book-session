import { useState } from "react";

import useEventSearchApi from "./useEventSearchApi";

const useEventSearchInputs = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");
    useEventSearchApi({title, description, dateOrder});
    return { setTitle, setDescription, setDateOrder, title, description, dateOrder }
}

export default useEventSearchInputs;