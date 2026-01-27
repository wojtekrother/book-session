import { createContext, ReactNode, useContext, useState } from "react"
import { toast } from "react-toastify";
import { getUser } from "../api/UserApi";
import { User } from "../types/types";


type AuthContextValue = {
    login: LoginProps;
    logout: LogoutProps;
    isLoggedIn: IsLoggedInProps;
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context == null) {
        throw Error("AuthContext is null.")
    }
    return context;
}

type AuthContextProviderProps = {
    children: ReactNode
}

type LoginProps = ({ login, password }: { login: string, password: string }) => Promise<User>;
type LogoutProps = () => void;
type IsLoggedInProps = () => boolean;

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [userLogin, setUserLogin] = useState<string | null>(null);

    const login: LoginProps = async ({ login, password }) => {
        //TODO check password
        if (userLogin != null) {
            throw new Error("User is allready loggied in. Loggout user before login.");
        }
        if (login === null || password == null) {
            throw new Error("Login and password is reqiured");
        }

        const user = await getUser(login)

        if (user == null) {
            throw new Error("Login error try again.")
        } else {
            toast.success("User loged in successfuly.")
            setUserLogin(login);
        }
        return user;
    }

    const logout: LogoutProps = () => {
        if (userLogin == null) {
            toast.error("User is allredy logged out.");
            return;
        }
        toast.success("Loggout successful")
        setUserLogin(null);
    }

    const isLoggedIn: IsLoggedInProps = () => {
        return userLogin != null;
    }


    let ctx: AuthContextValue = {
        login,
        logout,
        isLoggedIn
    }

    return (
        <AuthContext.Provider value={ctx}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider