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
    login: string,
    password: string,
    eventsIds: string[],
    deleteAt?: string,
    createdAt?: string,
    modifiedAt?: string
}