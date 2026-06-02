
export type CategoryDTO = {
    id: string
    name: string
    description: string
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

export interface NewCategoryRes {
    category_id: string
}