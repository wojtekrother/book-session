import { useMutation, useQuery } from "@tanstack/react-query"
import { UserApi } from "./UserApi"
import { queryClient } from "../../App"
import { AuthResponse, Tokens } from "../../features/shared/schema/tokens.schema"
import { UserCreateDTO, UserLoginDTO } from "../../features/user/schema/user.schema"

const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => UserApi.getUserById(id),
        enabled: !!id
    })
}

const useGetUserByEmail = (email: string) => {
    return useQuery({
        queryKey: ["users", email],
        queryFn: () => UserApi.getUserByEmail(email),
        enabled: !!email
    })
}

const useUpdateUserAddEvent = () => {
    return useMutation<void, Error, string>({
        mutationFn: (eventId) => UserApi.userAddEvent(eventId),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }) }
    })
}

const useUpdateUserRemoveEvent = () => {
    return useMutation<void, Error, string>({
        mutationFn: (eventId) => UserApi.userRemoveEvent(eventId),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }) }
    })
}


const useLoginUser = () => {
    return useMutation<AuthResponse, Error, UserLoginDTO>({
        mutationFn: (credentials) => UserApi.login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["loggedInUser"]})
        }
    })
}

const useRegisterUser = () => {
    return useMutation<AuthResponse, Error, UserCreateDTO>({
        mutationFn: (user) => UserApi.register(user)
    })
}

const useGetLoggedInUser = () => {
    return useQuery({
        queryKey: ["loggedInUser"],
        queryFn: () => UserApi.getLoggedInUser(),
        staleTime: 60 * 1000
    })
}

const logoutUser = () => {
    UserApi.logout();
    queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
}

export {
    useGetUserById,
    useGetUserByEmail,
    useUpdateUserAddEvent,
    useUpdateUserRemoveEvent,
    useLoginUser,
    useRegisterUser,
    useGetLoggedInUser,
    logoutUser
}