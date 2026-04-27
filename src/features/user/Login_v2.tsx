import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";
import ErrorField from "../../components/ui/ErrorField";
import useForm from "../../shared/hooks/useForm";
import { UserLoginDTO } from "./schema/user.schema";
import { useGetLoggedInUser, useLoginUser } from "../../services/api/UserApiQuery";
import { validateLogin, validatePassword } from "../shared/validator/fieldValidators";



const LoginPage = () => {
    const form = useForm<UserLoginDTO>({initialValue:{
        email: "",
        password: ""
    }, initFieldsValidators:{
        email: validateLogin,
        password: validatePassword
    }})



    const [globalError, setGlobalError] = useState<string[]>([]);
    const navigation = useNavigate();
    const loginUser = useLoginUser();
    const loggedInUser = useGetLoggedInUser();


    useEffect(() => {
        if (loggedInUser.data) {
            navigation("/user/events")
        }
    }, [loggedInUser.data])




    async function submitForm(form: UserLoginDTO) {


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
                    <Button href="/">Return to home page</Button>
                    <Button disabled={!(form.values["email"] && form.values["password"])} >Login</Button>
                </div>
            </form>

        </div>
    )

}

export default LoginPage;