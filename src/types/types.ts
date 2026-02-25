export type Event = {
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

export type User = {
    id?: string,
    email: string,
    password: string,
    eventsIds: string[],
    role: "User" | "Admin"
    deleteAt?: string,
    createdAt?: string,
    modifiedAt?: string
}

export type AccessToken = {
    "accessToken" : string
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