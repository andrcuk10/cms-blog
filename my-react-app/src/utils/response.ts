export type CategoryDTO = {
    id: string
    name: string
    description: string
}

export type UserDTO = {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
    status: boolean
}

export type Author = {
    id: string
    first_name: string
    last_name: string
}

export type Tag = {
    id: string
    name: string
}

export type NewsDTO = {
    id: string
    title: string
    text: string
    createdAt: string
    visits: number
    author: Author
    tags: Tag[]
    category: CategoryDTO
}

export type metaData = {
    currentPage: number
    pageCount: number
    total: number
}

export interface CategoryListingPage {
    categories: CategoryDTO[]
    meta: metaData
}

export interface UserListingPage {
    users: UserDTO[]
    meta: metaData
}

export interface NewsListingPage {
    news: NewsDTO[]
    meta: metaData
}

export interface NewCategoryRes {
    category_id: string
}

export interface NewNewsRes {
    news_id: string
}

export interface SingleNewsRes {
    news: NewsDTO
}

export interface NewUserRes {
    user_id: string
}

export interface SingleUserRes {
    user: UserDTO
}

export interface UserUpdateRes {
    user_id: string
    status: boolean
}
