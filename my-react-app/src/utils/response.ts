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

export type Comment = {
    id: string;
    author: string;
    text: string;
    createdAt: string;
    like: number;
    dislike: number;
};

export type NewsDTO = {
    id: string
    title: string
    text: string
    createdAt: string
    visits: number
    like: number
    dislike: number
    author: Author
    tags: Tag[]
    category: CategoryDTO
    comments: Comment[]
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

export interface SingleCategoryRes {
    category: CategoryDTO
}

export interface NewCommentRes {
    comment_id: string
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
