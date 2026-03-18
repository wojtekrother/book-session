import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useUserContext } from "../../context/old/UserContext.old";
import { useNavigate } from "react-router-dom";
import { StringUtils } from "../../utils/string";
import ErrorField from "../../components/ui/ErrorField";
import useForm from "../../hooks/useForm";
import { UserCreateDTO, UserLoginDTO } from "./schema/user.schema";
import { useLoginUser } from "../../services/api/UserApiQuery";


const validateLogin = (login: string): string | null => {
    if (StringUtils.isBlank(login)) {
        return "Login is required"

    }
    return null
}

const validatePassword = (password: string): string | null => {
    if (StringUtils.isBlank(password)) {
        return "Password is required";
    }
    return null;
}


const RegisterPage = () => {
    // const form = useForm<UserCreateDTO>({
    //     email: "",
    //     password: ""
    // })

    const form = useForm<UserLoginDTO>({
        email: "",
        password: ""
    }, {
        email: validateLogin,
        password: validatePassword
    })



    const [globalError, setGlobalError] = useState<string[]>([]);
    // const authContext = useUserContext();
    const navigation = useNavigate()
    const loginUser = useLoginUser()


    // useEffect(() => {
    //     if (authContext.isLoggedIn) {
    //         navigation("/user/events")
    //     }
    // }, [authContext.isLoggedIn])


    if (form.validators?.email == undefined) {
        form.setValidators({ email: validateLogin, password: validatePassword })
    }

    async function submitForm(form: UserLoginDTO) {


        // if (!validateLogin(form.values["email"]) || !validatePassword(form.values["password"])) {
        //     setGlobalError(["Login and password is reqired."]);
        //     return;
        // }

        try {
            loginUser.mutate(form, {
                onError: (error) => {
                    setGlobalError([error.message]);
                },
                onSuccess: () => { navigation("/user/events") }
            });
        } catch (e: unknown) {
            if (e instanceof Error) {

                return;
            }
        }

    }

    return (
        <div className="bg-amber-50 p-2 max-w-2xl min-w-xl mx-auto">
            <form onSubmit={form.handleSubmit(submitForm)}>
                <ErrorField errors={globalError} />
                <div className="control">
                    <Input label="Login" {...form.register("email")}></Input>
                    <Input label="Password" {...form.register("password")}></Input>
                </div>
                <div className="actions">
                    <Button textOnly>Cancel</Button>
                    <Button disabled={!(form.values["email"] && form.values["password"])} >Register</Button>
                </div>
            </form>

        </div>
    )

}

export default RegisterPage;