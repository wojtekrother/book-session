import { useEffect, useState } from "react";
import Button from "../../shared/components/ui/Button";
import Input from "../../shared/components/ui/Input";
import { useNavigate } from "react-router-dom";
import ErrorField from "../../shared/components/ui/ErrorField";
import useForm from "../../shared/hooks/useForm";
import { UserCreateDTO } from "./schema/user.schema";
import { useGetLoggedInUser, useRegisterUser } from "../../services/api/UserApiQuery";
import { validateFirstName, validateLastName, validateLogin, validatePassword } from "../shared/validator/fieldValidators";
import { toast } from "react-toastify";
import { registerValidate } from "./validator/registerValidator";

const RegisterPage = () => {
    const form = useForm<UserCreateDTO>({
        initialValue: {
            email: "",
            password: "",
            confirmPassword: "",
            first_name: "",
            last_name: ""
        }, initFieldsRequired: {
            email: true,
            password: true,
            confirmPassword: true,
            first_name: true,
            last_name: true
        }, initFieldsValidators: {
            email: validateLogin,
            password: validatePassword,
            first_name: validateFirstName,
            last_name: validateLastName
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
        console.log(form)
        try {
            registerUser.mutate(form, {
                onError: (error) => {
                    setGlobalError([error.message]);
                },
                onSuccess: () => {
                    toast.success("Thank you for registration :)")
                    navigation("/user/events")
                }
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setGlobalError([e.message]);
                return;
            }
        }
    }

    return (
        <div className="bg-gray-50 p-2 max-w-2xl min-w-xl mx-auto">
            <form onSubmit={form.handleSubmit(submitForm)}>
                <ErrorField errors={globalError} />

                <div className="control">
                    <Input label="Login" {...form.register("email")}></Input>
                    <Input label="Password" {...form.register("password")}></Input>
                    <Input label="Confirm Password" {...form.register("confirmPassword")}></Input>
                    <Input label="First name" {...form.register("first_name")}></Input>
                    <Input label="Last name" {...form.register("last_name")}></Input>
                </div>
                <div className="actions">
                    <Button textonly={true} type="button">Cancel</Button>
                    <Button>Register</Button>
                </div>
            </form>

        </div>
    )

}

export default RegisterPage;