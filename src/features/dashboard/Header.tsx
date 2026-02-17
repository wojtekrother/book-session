import { useEffect, useRef } from "react"
import CreateEventModal, { CreateEventModalHandler } from "../../modal/CreateEventModal"
import Button from "../../components/ui/Button"
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { ModalHandler } from "../../modal/Modal";



const Header = () => {
    const modal = useRef<CreateEventModalHandler>(null);
    const modal1 = useRef<ModalHandler>(null);
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
            <CreateEventModal ref={modal} />
            <h1 className="text-2xl ">Booking event</h1>
            <nav >
                <ul className="flex items-center gap-2">
                    <li className="mr-auto"><Button href="/" >Home</Button></li>
                    {authContext.isLoggedIn &&
                        <li><Button onClick={handleLogoutClik} textOnly>Logout</Button></li>}
                    {!authContext.isLoggedIn &&
                        <li><Button href="/user/login">Login</Button></li>}
                    <li><Button href="/events">Events</Button></li>
                    {authContext.isLoggedIn &&
                        <li><Button href="/user/events">My events</Button></li>}
                    <li><Button textOnly onClick={() => modal.current?.open()} >Create new event</Button></li>
                     <li><Button textOnly onClick={() => modal1.current?.open()} >TEST</Button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header