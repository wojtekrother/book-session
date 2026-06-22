import { createContext, useCallback, useContext, useState } from "react";



export type AuthContextValue = {
    user: string| null;
    login: (name:string) =>Promise<void>,
    logout: () => void
} 

const AuthContex = createContext<AuthContextValue|null>(null);

export function useAuthContext() {
    const ctx = useContext(AuthContex)
    if (ctx == null) {
        throw new Error ("Missing Auth context")
    }
    return ctx
}


type AuthApi= {
    login: (name:string) => Promise<string>,
    logout: () => void
}

const AuthProvider = ({api, children}:{api:AuthApi, children:React.ReactNode}) => {
    const [user, setUser] = useState<string>("")

    const login = useCallback(async (name:string) => {
        const correntLogin = await api.login(name)
        setUser(correntLogin)
        
},[api])

const logout = useCallback(() => {
        api.logout()
        setUser("")
},[api])

const  authCtx =  {
    user,
    login,
    logout 
}
    return <AuthContex.Provider value={authCtx}>
        {children}
    </AuthContex.Provider>
}


export default  AuthProvider