import { useMutation, useQuery } from "@tanstack/react-query"
import { UserApi } from "./UserApi"
import { queryClient } from "../../App"
import { AuthResponse } from "../../features/shared/schema/tokens.schema"
import { UserCreateDTO, UserDTO, UserLoginDTO } from "../../features/user/schema/user.schema"

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

type UserContext = {
    previousUser?: UserDTO;
};

const useUpdateUserAddEvent = () => {
    return useMutation<void, Error, string, UserContext>({
        mutationFn: (eventId) => UserApi.userAddEvent(eventId),
        onMutate: async (eventId, context) => {
            
            await queryClient.cancelQueries({ queryKey: ['loggedInUser'] });
            const previousUser = queryClient.getQueryData<UserDTO>(['loggedInUser']);

            queryClient.setQueryData<UserDTO>(['loggedInUser'], (old) => {
                if (!old) return old;
                return { ...old, eventsIds: [...old.eventsIds, eventId] };
            });
            return { previousUser };
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["loggedInUser"] }) },
        onError: (err, eventId, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(['loggedInUser'], context.previousUser);
            }
            throw err;
        }
    })
}

const useUpdateUserRemoveEvent = () => {
    return useMutation<void, Error, string, UserContext>({
        mutationFn: (eventId) => UserApi.userRemoveEvent(eventId),
        onMutate: async (eventId, context) => {
            
            await queryClient.cancelQueries({ queryKey: ['loggedInUser'] });
            const previousUser = queryClient.getQueryData<UserDTO>(['loggedInUser']);

            queryClient.setQueryData<UserDTO>(['loggedInUser'], (old) => {
                if (!old) return old;
                return { ...old, eventsIds: old.eventsIds.filter((item => item !== eventId)) };
            });
            return { previousUser };
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }) },
        onError: (err, eventId, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(['loggedInUser'], context.previousUser);
            }
            throw err;
        }
    })
}


const useLoginUser = () => {
    return useMutation<AuthResponse, Error, UserLoginDTO>({
        mutationFn: (credentials) => UserApi.login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loggedInUser"] })
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