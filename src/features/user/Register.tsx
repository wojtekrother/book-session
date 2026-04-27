import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { useNavigate } from "react-router-dom";
import ErrorField from "../../components/ui/ErrorField";
import useForm, { Errors } from "../../shared/hooks/useForm";
import { UserCreateDTO } from "./schema/user.schema";
import { useGetLoggedInUser, useRegisterUser } from "../../services/api/UserApiQuery";
import { validateLogin, validatePassword } from "../shared/validator/fieldValidators";

const registerValidate = (register: UserCreateDTO): Errors<UserCreateDTO> => {
    let errors: Errors<UserCreateDTO> = {};

    if (register.password !== register.confirmPassword) errors.confirmPassword = "Confirm password is not the same like password";
    return errors
}


const RegisterPage = () => {
    const form = useForm<UserCreateDTO>({
        initialValue: {
            email: "",
            password: "",
            confirmPassword: "",
        }, initFieldsValidators: {
            email: validateLogin,
            password: validatePassword
        }, intiCrossFieldValidator: registerValidate
    })



    const [globalError, setGlobalError] = useState<string[]>([]);
    const navigation = useNavigate()
    const registerUser = useRegisterUser();
    const loggedInUser = useGetLoggedInUser();

    useEffect(() => {
        if (loggedInUser.data) {
            navigation("/user/events")
        }
    }, [loggedInUser.data])

    async function submitForm(form: UserCreateDTO) {

        try {
            registerUser.mutate(form, {
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
                    <Input label="Confirm Password" {...form.register("confirmPassword")}></Input>
                </div>
                <div className="actions">
                    <Button textonly={true}>Cancel</Button>
                    <Button disabled={!form.isFormReady()} >Register</Button>
                </div>
            </form>

        </div>
    )

}

export default RegisterPage;