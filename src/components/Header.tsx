import { useEffect, useRef } from "react"
import CreateSessionModal, { CreateSessionModalHandler } from "../modal/CreateSessionModal"
import Button from "./Button"
import { useUserContext } from "../context/UserSession";
import { logoutAction } from "../actions/LogoutAction";
import { toast } from "react-toastify";



const Header = () => {
    const modal = useRef<CreateSessionModalHandler>(null);
    const authContext = useUserContext();

    useEffect(() => {
        console.log("Header refreshed")
    })

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
        <header id="main-header" className="from-blue-50 to-blue-300 bg-linear-to-t p-3">
            <CreateSessionModal ref={modal} />
            <h1 className="text-2xl ">Booking session</h1>
            <nav >
                <ul className="flex items-center gap-2">
                    <li className="mr-auto"><Button href="/" >Home</Button></li>
                    {authContext.isLoggedIn &&
                        <li><Button onClick={handleLogoutClik} textOnly>Logout</Button></li>}
                    {!authContext.isLoggedIn &&
                        <li><Button href="/user/login">Login</Button></li>}
                    <li><Button href="/sessions">Sessions</Button></li>
                    {authContext.isLoggedIn &&
                        <li><Button href="/mySessions">My sessions</Button></li>}
                    <li><Button textOnly onClick={() => modal.current?.open()} >Create new session</Button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header