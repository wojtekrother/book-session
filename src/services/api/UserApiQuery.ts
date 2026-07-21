import { useMutation, useQuery } from "@tanstack/react-query"
import { UserApi } from "./UserApi"
import { queryClient } from "../../App"
import { AuthResponseDTO } from "../../features/shared/schema/tokens.schema"
import { UserCreateDTO, UserDTO, UserLoginDTO } from "../../features/user/schema/user.schema"

export const userKeys = {
    loggedIn: ["loggedInUser"] as const,
};

type UserContext = {
    previousUser?: UserDTO;
};

const useUserLikeEvent = () => {
    return useMutation<void, Error, string, UserContext>({
        mutationFn: (eventId) => UserApi.userLikeEvent(eventId),
        onMutate: async (eventId, _context) => {

            await queryClient.cancelQueries({ queryKey: userKeys.loggedIn });
            const previousUser = queryClient.getQueryData<UserDTO>(userKeys.loggedIn);

            queryClient.setQueryData<UserDTO>(userKeys.loggedIn, (old) => {
                if (!old) return old;
                return { ...old, eventsIds: [...old.eventsIds, eventId] };
            });
            return { previousUser };
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: userKeys.loggedIn }) },
        onError: (err, _eventId, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(userKeys.loggedIn, context.previousUser);
            }
            throw err;
        }
    })
}

const useUserUnlikeEvent = () => {
    return useMutation<void, Error, string, UserContext>({
        mutationFn: (eventId) => UserApi.userUnlikeEvent(eventId),
        onMutate: async (eventId, _context) => {

            await queryClient.cancelQueries({ queryKey: userKeys.loggedIn });
            const previousUser = queryClient.getQueryData<UserDTO>(userKeys.loggedIn);

            queryClient.setQueryData<UserDTO>(userKeys.loggedIn, (old) => {
                if (!old) return old;
                return { ...old, eventsIds: old.eventsIds.filter((item => item !== eventId)) };
            });
            return { previousUser };
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: userKeys.loggedIn }) },
        onError: (err, _eventId, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(userKeys.loggedIn, context.previousUser);
            }
            throw err;
        }
    })
}


const useLoginUser = () => {
    return useMutation<AuthResponseDTO, Error, UserLoginDTO>({
        mutationFn: (credentials) => UserApi.login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.loggedIn })
        }
    })
}

const useRegisterUser = () => {
    return useMutation<AuthResponseDTO, Error, UserCreateDTO>({
        mutationFn: (createUser) => UserApi.register(createUser)
    })
}

const useGetLoggedInUser = () => {
    return useQuery({
        queryKey: userKeys.loggedIn,
        queryFn: () => UserApi.getLoggedInUser(),
        staleTime: 60 * 1000
    })
}

const logoutUser = () => {
    UserApi.logout();
    queryClient.invalidateQueries({ queryKey: userKeys.loggedIn });
}

export {
    useUserLikeEvent,
    useUserUnlikeEvent,
    useLoginUser,
    useRegisterUser,
    useGetLoggedInUser,
    logoutUser
}