import { useRef } from "react"
import Button from "../../shared/components/ui/Button";
import Modal, { ModalHandler } from "../../shared/modal/Modal";
import {  useGetLoggedInUser } from "../../services/api/UserApiQuery";
import CreateEventForm_v2 from "../event/forms/CreateEventForm";

import useLogout from "../../shared/hooks/useLogout";



const Header = () => {
    const {data:loggedInUser} = useGetLoggedInUser();
    const {logout} = useLogout();

    const modal = useRef<ModalHandler>(null);

    return (
        <header id="main-header" className="from-blue-50 to-blue-300 bg-linear-to-t p-3">
            {/* <CreateEventModal ref={modal} /> */}
            <Modal ref={modal} >{modal.current &&<CreateEventForm_v2 closeModal={modal.current.close} openModal={modal.current.open}/>}</Modal>
            <h1 className="text-2xl ">Booking event</h1>
            <nav >
                <ul className="flex items-center gap-2">
                    <li className="mr-auto"><Button href="/" >Home</Button></li>
                    {loggedInUser  &&
                        <li><Button onClick={logout} textonly={true}>Logout </Button></li>}
                    {!loggedInUser &&
                    <>
                        <li><Button href="/user/login">Login</Button></li>
                        <li><Button href="/user/register">Register</Button></li>
                        </>}
                    <li><Button href="/events">Events</Button></li>
                    {loggedInUser &&
                        <li><Button href="/user/events">My events ({loggedInUser?.eventsIds.length})</Button></li>}
                    <li><Button textonly={true} onClick={() => modal.current?.open()} >Create new event</Button></li>
                     
                </ul>
            </nav>
        </header>
    )
}

export default Header