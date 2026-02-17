import { toast } from "react-toastify";
import { useUserContext } from "../../context/UserContext";
import { useEffect } from "react";

const Loggout = () => {
    const ctx = useUserContext();

    useEffect(() => {
        toast.info("useEffect at work")
        try {
            ctx.logout()
            toast.success("Logout success.")
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message)
            }
            toast.error("Logout error.")
        }
    }, [])

    return <></>
}

export default Loggout;