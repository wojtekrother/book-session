import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { toast } from "react-toastify";

import { User } from "../types/types";
import { StringUtils } from "../utils/string";
import { getUserByLogin } from "../api/UserApi";
import { useBookSesscionContext } from "./SessionsContext";


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
type LogoutProps = () => boolean;
type IsLoggedInProps = () => boolean;

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);


   
    
    const login: LoginProps = async ({ login, password }) => {
    
        if (user != null) {
            throw new Error("User is allready loggied in. Loggout user before login.");
        }
        if (StringUtils.isBlank(login) || StringUtils.isBlank(password)) {
            throw new Error("Login and password is reqiured");
        }

        const newUser = await getUserByLogin(login);

        if (newUser == null || newUser.password !== password) {
            throw new Error("Invalid login or password")
        } 

        setUser(newUser);
        return newUser;
    }

    const logout: LogoutProps = () => {
        if (user == null) {
            throw new Error("User is allredy logged out.");
        }
        setUser(null);
        return true
    }

    const isLoggedIn: IsLoggedInProps = () => {
        return user != null;
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