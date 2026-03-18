import { useRef } from "react"
import Button from "../../components/ui/Button"
import { toast } from "react-toastify";
import Modal, { ModalHandler } from "../../modal/Modal";
import { logoutUser, useGetLoggedInUser } from "../../services/api/UserApiQuery";
import { useNavigate } from "react-router-dom";
import CreateEventForm from "../../modal/CreateEventForm";



const Header = () => {
    const {data:loggedInUser} = useGetLoggedInUser();
    const navigate =  useNavigate();

    const modal = useRef<ModalHandler>(null);


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
            {/* <CreateEventModal ref={modal} /> */}
            <Modal ref={modal} >{modal.current &&<CreateEventForm closeModal={modal.current.close}/>}</Modal>
            <h1 className="text-2xl ">Booking event</h1>
            <nav >
                <ul className="flex items-center gap-2">
                    <li className="mr-auto"><Button href="/" >Home</Button></li>
                    {loggedInUser  &&
                        <li><Button onClick={handleLogoutClik} textOnly>Logout </Button></li>}
                    {!loggedInUser &&
                    <>
                        <li><Button href="/user/login">Login</Button></li>
                        <li><Button href="/user/register">Register</Button></li>
                        </>}
                    <li><Button href="/events">Events</Button></li>
                    {typeof loggedInUser === "object" &&
                        <li><Button href="/user/events">My events</Button></li>}
                    <li><Button textOnly onClick={() => modal.current?.open()} >Create new event</Button></li>
                     
                </ul>
            </nav>
        </header>
    )
}

export default Header