import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuthContext } from "../context/AuthSession";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [userLogin, setUsrLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const authContext = useAuthContext();
    const navigation = useNavigate()


    function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        authContext.login({login: userLogin, password}) 
        navigation("/")
    }

    return (
        <div>
            <form onSubmit={submitForm}>
                <Input name="userLogin" label="Login"></Input>
                <Input name="password" label="Password"></Input>
                <div className="actions">
                    <Button textOnly>Cancel</Button>
                    <Button >Login</Button>
                </div>
            </form>
        
        </div>
    )

}

export default LoginPage;