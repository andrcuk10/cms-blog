import type { UserDTO } from "./response"

export type NewsProp = {
    id: string
    title: string
    text: string
    categoryId: string
    tags: string[]
}

export type PasswordType = {
    password: string
    confirm_password: string
}

export type CommentType = {
    id: string
    author: string
    text: string
}

export type CreateUserType = UserDTO & PasswordType