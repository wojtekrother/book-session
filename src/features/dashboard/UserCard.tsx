import { useGetLoggedInUser } from "../../services/api/UserApiQuery";

const UserCard = () => {
    const { data: loggedInUser } = useGetLoggedInUser();

    return <>
        <div className="rounded-4xl bg-gray-100/60 h-9 min-w-40 max-w-60 flex">
            <div className="rounded-4xl bg-gray-200 flex items-center justify-center h-8 w-8 m-0.5"> 
                {loggedInUser?.firstName[0]}{loggedInUser?.lastName[0]}
            </div>
            <div className="flex items-center">
                <div className=" p-0 text-sm">{loggedInUser?.firstName} {loggedInUser?.lastName}
                    <span className="text-xs text-gray-500 px-1">({loggedInUser?.role === 'user' ? "User": "Admin"})</span>
                </div>
            </div>
        </div>
    </>
} 

export default UserCard;