import { useRef } from "react"
import CreateEventModal, { CreateEventModalHandler } from "../../modal/CreateEventModal"
import Button from "../../components/ui/Button"
import { toast } from "react-toastify";
import { ModalHandler } from "../../modal/Modal";
import { logoutUser, useGetLoggedInUser } from "../../services/api/UserApiQuery";
import { useNavigate } from "react-router-dom";



const Header = () => {
    const {data:loggedInUser} = useGetLoggedInUser();
    const navigate =  useNavigate();

    const modal = useRef<CreateEventModalHandler>(null);
    const modal1 = useRef<ModalHandler>(null);


    function handleLogoutClik() {
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


    return (
        <header id="main-header" className="from-blue-50 to-blue-300 bg-linear-to-t p-3">
            <CreateEventModal ref={modal} />
            <h1 className="text-2xl ">Booking event</h1>
            <nav >
                <ul className="flex items-center gap-2">
                    <li className="mr-auto"><Button href="/" >Home</Button></li>
                    {loggedInUser  &&
                        <li><Button onClick={handleLogoutClik} textOnly>Logout </Button></li>}
                    {!loggedInUser &&
                        <li><Button href="/user/login">Login</Button></li>}
                    <li><Button href="/events">Events</Button></li>
                    {typeof loggedInUser === "object" &&
                        <li><Button href="/user/events">My events</Button></li>}
                    <li><Button textOnly onClick={() => modal.current?.open()} >Create new event</Button></li>
                     <li><Button textOnly onClick={() => modal1.current?.open()} >TEST</Button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header