import { render, renderHook } from "@testing-library/react";
import { createContext, useContext, useState, ReactNode, act } from "react";

interface User {
    id: number;
    name: string;
}

interface UserContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (newUser: User) => setUser(newUser);
    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
};


describe("Context test", () => {
    it("Contex required", () => {
        expect(() => renderHook(() => useUser())).toThrow("useUser must be used within UserProvider")
    })
    it("Contex work", () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <UserProvider>{children}</UserProvider>
        );

        const { result } = renderHook(() => useUser(), { wrapper });
        expect(result.current.user).toBe(null)
        act(() => { result.current.login({ id: 1, name: "Ewa" }) })
        expect(result.current.user).toEqual({ id: 1, name: "Ewa" })
        act(() => { result.current.logout() })
        expect(result.current.user).toBe(null)

    })

})