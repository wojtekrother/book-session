import { useRef } from "react"
import Button from "../../shared/components/ui/Button";
import Modal, { ModalHandler } from "../../shared/modal/Modal";
import { useGetLoggedInUser } from "../../services/api/UserApiQuery";
import CreateEventForm_v2 from "../event/forms/CreateEventForm";
import useLogout from "../../shared/hooks/useLogout";
import UserCard from "./UserCard";

const Header = () => {
    const { data: loggedInUser } = useGetLoggedInUser();
    const { logout } = useLogout();

    const modal = useRef<ModalHandler>(null);

    return (
        <>
            <Modal ref={modal} >
                <CreateEventForm_v2
                    closeModal={() => modal.current?.close()}
                    openModal={() => modal.current?.open()} />
            </Modal>

            <header id="main-header" className="from-blue-50 to-blue-300 bg-linear-to-t p-3">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl ">Booking event</h1>
                    <div>
                        {loggedInUser && <UserCard />}
                    </div>
                </div>
                <nav >
                    <ul className="flex items-center gap-2">
                        <li className="mr-auto"><Button href="/" >Home</Button></li>

                        <li><Button href="/events">Events</Button></li>
                        {loggedInUser &&
                            <li><Button href="/user/events">My events ({loggedInUser?.eventsIds.length})</Button></li>
                        }
                        {loggedInUser &&
                            <li><Button textonly={false} onClick={() => modal.current?.open()} >Create new event</Button></li>
                        }
                        {loggedInUser &&
                            <li><Button onClick={logout} textonly={false}>Logout </Button></li>
                        }
                        {(!loggedInUser) &&
                            <>
                                <li><Button href="/user/login">Login</Button></li>
                                <li><Button href="/user/register">Register</Button></li>
                            </>
                        }
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header