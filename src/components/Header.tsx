import Button from "./Button"



const Header = () => {

    return (
        <header id="main-header">
            <h1>Booking session</h1>
            <nav>
                <ul>
                    <li><Button href="/">Home</Button></li>
                    <li><Button href="/sessions">Sessions</Button></li>
                    <li><Button href="/mySessions">My sessions</Button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header