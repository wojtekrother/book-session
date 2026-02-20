import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import AuthProvider, { useAuthContext } from "./AuthContext";

type Profile = {
    id: number;
    name: string;
    email: string;
};

export function useProfile(fetchProfile: () => Promise<Profile>) {
    const [profile, setProfile] = React.useState<Profile | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetchProfile()
            .then(setProfile)
            .catch(() => setError("Błąd pobierania profilu"))
            .finally(() => setLoading(false));
    }, [fetchProfile]);

    return { profile, loading, error };
}


it("test hooka 2 ", async () => {

    const mockSuccess = vi.fn().mockResolvedValue({
        id: 1,
        name: "name",
        email: "email"
    }
    )
    

    vi.useFakeTimers()
    const { result } = renderHook(() => useProfile(mockSuccess));
    //warunki początkowe
    expect(result.current.loading).toBe(true);
    expect(result.current.profile).toBe(null);
    expect(result.current.error).toBe(null);
    vi.advanceTimersByTime(500)

    await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.profile).toEqual({
            id: 1,
            name: "name",
            email: "email"
        });
        expect(result.current.error).toBe(null);
    })
    vi.useRealTimers()
    expect(mockSuccess).toHaveBeenCalledTimes(1);
})
  it("test hooka 2 faliure", async () => {

    const mockFaliure = vi.fn().mockRejectedValue(new Error("Fetch error"))
vi.useFakeTimers()
    const { result: resultFaluire } = renderHook(() => useProfile(mockFaliure));
    //warunki początkowe
    expect(resultFaluire.current.loading).toBe(true);
    expect(resultFaluire.current.profile).toBe(null);
    expect(resultFaluire.current.error).toBe(null);

    
    await waitFor(() => {
        expect(resultFaluire.current.loading).toBe(false)
    })
    vi.useRealTimers()

    expect(resultFaluire.current.loading).toBe(false);
    expect(resultFaluire.current.profile).toBe(null);
    expect(resultFaluire.current.error).toBe("Błąd pobierania profilu");
    expect(mockFaliure).toHaveBeenCalledTimes(1);

})


it("test context",async  ()=> {
    const renderWithContext = (ui: React.ReactNode) => render(<AuthProvider>{ui}</AuthProvider>);

    expect(renderWithContext.current.user).toBe(null)
    vi.useFakeTimers()
    renderWithContext.current.login({name:"Adam"})
    vi.advanceTimersByTime(300)
    await waitFor(()=>{
        expect(renderWithContext.current.user).toEqual({id:1, name:"Adam"})
    })

    vi.useRealTimers()
})


describe("AuthProvider", () => {
  it("should login user", async () => {
    const mockApi = {
      login: vi.fn().mockResolvedValue("Adam"),
      logout: vi.fn().mockRejectedValue(new Error("Server timeout"))
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider api={mockApi}>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current.user).toBe(null);
    act(()=> await result.current.login("Adam"))
    waitFor(() => {
        expect(result.current.user).toBe("Adam");
    }
    expect(mockApi.login).toHaveBeenCalledTimes(1)
    expect(mockApi.login).toHaveBeenCalledWith(["Adam"])


    expect(act(()=>  result.current.logout())).toThrow()
expect(mockApi.logout).toHaveBeenCalledTimes(1)

    expect().toBeInstanceOf(Error)
  });
});