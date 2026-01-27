export type BookSession = {
    id?: string,
    title: string,
    summary: string,
    description:string
    duration: number,
    date: string,
    image?: string,
    imageUrl?: String
}

export type User = {
    id?: string,
    login: string,
    password: string,
    sessionsId: string[]
}