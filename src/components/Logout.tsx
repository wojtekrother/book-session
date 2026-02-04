import { toast } from "react-toastify";
import { logoutAction } from "../actions/LogoutAction";
import { useUserContext } from "../context/UserSession";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loggout = () => {
    const ctx = useUserContext();
    const navigate = useNavigate()

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