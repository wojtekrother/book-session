import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useUserContext } from "../../context/old/UserContext.old";
import { useNavigate } from "react-router-dom";
import { StringUtils } from "../../utils/string";
import ErrorField from "../../components/ui/ErrorField";


const RegisterPage = () => {
    const [userLogin, setUserLogin] = useState<string>("");
    const [userLoginError, setUserLoginError] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [globalError, setGlobalError] = useState<string[]>([]);
    const authContext = useUserContext();
    const navigation = useNavigate()


    useEffect(() => {
        if (authContext.isLoggedIn) {
            navigation("/user/events")
        }
    },[authContext.isLoggedIn])

    function handleUserLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
        let login = e.target.value;
        validateLogin(login);
        setUserLogin(login.trim());
    }

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        let password = e.target.value;
        validatePassword(password)
        setPassword(password.trim())
    }

    const validateLogin = (login: string): boolean => {
        setGlobalError([]);
        setUserLoginError("")
        if (StringUtils.isBlank(login)) {
            setUserLoginError("Login is required")
            return false;
        }
        return true
    }

    const validatePassword = (password: string): boolean => {
        setGlobalError([]);
        setPasswordError("")
        if (StringUtils.isBlank(password)) {
            setPasswordError("Password is required");
            setGlobalError([]);
            return false;
        }
        return true
    }

    async function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setGlobalError([]);
        if (!validateLogin(userLogin) || !validatePassword(password)) {
            setGlobalError(["Login and password is reqired."]);
            return;
        }

        try {
            await authContext.login({ email: userLogin, password });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setGlobalError([e.message]);
                return;
            }
        }

    }

    return (
        <div className="bg-amber-50 p-2 max-w-2xl min-w-xl mx-auto">
            <form onSubmit={submitForm}>
                <ErrorField errors={globalError} />
                <div className="control">
                    <Input name="userLogin" label="Login" value={userLogin} error={userLoginError} onChange={handleUserLoginChange}></Input>
                    <Input name="password" label="Password" value={password} error={passwordError} onChange={handlePasswordChange}></Input>
                </div>
                <div className="actions">
                    <Button textOnly>Cancel</Button>
                    <Button disabled={!(userLogin && password)} >Login</Button>
                </div>
            </form>

        </div>
    )

}

export default RegisterPage;