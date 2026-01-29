import { useRef } from "react"
import AddModal, { AddModalHandler } from "../modal/AddModal"
import Button from "./Button"
import { useAuthContext } from "../context/AuthSession";
import { logoutAction } from "../actions/LogoutAction";
import { toast } from "react-toastify";



const Header = () => {
    const modal = useRef<AddModalHandler>(null);
    const authContext = useAuthContext();

    function handleLogoutClik() {
        try {
        authContext.logout()
        toast.success("Logout success.")
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message)
        }
        toast.error("Logout error.")
    }
    }


    return (
        <header id="main-header">
            <AddModal ref={modal} />
            <h1>Booking session</h1>
            <nav>
                <ul>
                    <li><Button href="/" >Home</Button></li>
                    {authContext.isLoggedIn() && <li><Button onClick={handleLogoutClik} textOnly>Logout</Button></li>}
                    {!authContext.isLoggedIn() && <li><Button href="/user/login">Login</Button></li>}
                    <li><Button href="/sessions">Sessions</Button></li>
                    {authContext.isLoggedIn() &&
                        <li><Button href="/mySessions">My sessions</Button></li>}
                    <li><Button textOnly onClick={() => modal.current?.open()} >Create new session</Button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header