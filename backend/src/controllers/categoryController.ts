import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entities/Category";

const categoryRepository = AppDataSource.getRepository(Category)

export const getCategories = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = req.skip;

    const [categories, total] = await categoryRepository.findAndCount({
        skip: offset,
        take: limit,
    })

    res.json({ 
        categories,
        meta: {
            total,
            pageCount: Math.ceil(total / limit),
            currentPage: parseInt(req.query.page as string, 10) || 1,
        }
    })
}

export const getCategory = async (req: Request, res: Response) => {
    const category = await categoryRepository.findOne({ where: { id: req.params.id as string } })

    if(!category) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    res.json({ category })
}

export const createCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body

    const category = await categoryRepository.findOne({ where: { name } })
    if(category) {
        return res.status(400).json({ code: "DUPLICATE_CATEGORY" })
    }

    const newCategory = categoryRepository.create({ name, description })
    const savedCategory = await categoryRepository.save(newCategory)

    res.status(201).json({ category_id: savedCategory.id })
}

export const updateCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body

    const category = await categoryRepository.findOne({ where: { id: req.params.id as string }})
    if(!category) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    // Category name mora da bude jedinstven
    if(name) {
        const checkCategory = await categoryRepository.findOne({ where: { name } })
        if(checkCategory) return res.status(400).json({ code: 'DUPLICATE_CATEGORY' })
        category.name = name
    }
    if(description) category.description = description

    const updateCategory = await categoryRepository.save(category)

    res.json({ category_id: updateCategory.id })
}

// potrebno je implementirati logiku gde se kategorija ne moze obrisati ukoliko ona ima neku vest
export const deleteCategory = async (req: Request, res: Response) => {
    const category = await categoryRepository.findOne({
        where: { 
            id: req.params.id as string 
        },
        relations: { 
            news: true 
        }
    })

    if(!category) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    if(category.news.length !== 0) {
        return res.status(400).json({ code: 'CATEGORY_HAS_NEWS' })
    }

    await categoryRepository.remove(category)
    
    res.status(204).json({})
}