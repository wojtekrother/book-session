import { useMutation, useQuery } from "@tanstack/react-query"
import { UserApi } from "./UserApi"
import { queryClient } from "../../App"
import { AccessToken, UserCreateDTO } from "../../types/types"

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
    return useMutation<AccessToken, Error, { email: string, password: string }>({
        mutationFn: ({ email, password }) => UserApi.login(email, password)
    })
}

const useRegisterUser = () => {
    return useMutation<AccessToken, Error, UserCreateDTO>({
        mutationFn: (user) => UserApi.register(user)
    })
}

export { useGetUserById, useGetUserByEmail, useUpdateUserAddEvent, useUpdateUserRemoveEvent, useLoginUser, useRegisterUser }