import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/api/UserApiQuery";

export default function useLogout() {
    const navigate = useNavigate();
    function logout() {
        try {
            logoutUser();
            toast.success("Logout success.");
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message)
            }
            toast.error("Logout error.")
        }
    }

    return { logout }
}