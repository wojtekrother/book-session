import { useEffect } from "react";
import useLogout from "../../hooks/useLogout";

const Loggout = () => {
    const { logout } = useLogout()

    useEffect(() => {
        logout();
    }, [])

    return <></>
}

export default Loggout;