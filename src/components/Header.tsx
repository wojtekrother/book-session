import { useRef } from "react"
import AddModal, { AddModalHandler } from "../modal/AddModal"
import Button from "./Button"



const Header = () => {
    const modal = useRef<AddModalHandler>(null);

    return (
        <header id="main-header">
            <AddModal ref={modal}/>
            <h1>Booking session</h1>
            <nav>
                <ul>
                    <li><Button href="/" >Home</Button></li>
                    <li><Button href="/sessions">Sessions</Button></li>
                    <li><Button href="/mySessions">My sessions</Button></li>
                    <li><Button textOnly onClick={() => modal.current?.open()} >Create new session</Button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header