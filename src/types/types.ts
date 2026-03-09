export type EventDTO = {
    id?: string,
    title: string,
    summary: string,
    description:string
    duration: number,
    date: string,
    image?: string,
    imageUrl?: String,
    deleteAt?: string,
    createdAt?: string,
    modifiedAt?: string
}

export type EventCreateDTO ={
    title: string,
    summary: string,
    description:string
    duration: number,
    date: string,
    imageUrl?: String,
}

export type EventUpdateDTO = Partial<Omit<EventDTO, "id">> & {id:string}

export type UserDTO = {
    id: string,
    email: string,
    password: string,
    eventsIds: string[],
    role: "User" | "Admin"
    deleteAt?: string,
    createdAt: string,
    modifiedAt?: string
}

export type UserCreateDTO = {
    email: string,
    password: string
}



export type Tokens = {
    "accessToken" : string
    "refreshToken" : string
}

export type EventSearchForm = {
    title: string;
    description: string;
    dateOrder: "asc" | "desc";
}

// enum ApiErrorCode  {
//     SERVER_ERROR = "SERVER_ERROR",
//     CLIENT_ERROR = "CLIENT_ERROR"
// }


// export interface ApiError extends Error  {
//     code: ApiErrorCode
//     status: number
// }

// function ApiError(errorMessage) {
//     this.name = 'MyError';
//     this.message = message;
//     this.stack = (new Error()).stack;
    
// }
// ApiError.prototype = new Error; 

// class CustomError extends Error { /* ... */}