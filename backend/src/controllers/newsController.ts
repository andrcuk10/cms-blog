import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { News } from "../entities/News";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import { getTags } from "./tagsController";
import { Like } from "typeorm";

const newsRepository = AppDataSource.getRepository(News)
const userRepository = AppDataSource.getRepository(User)
const categoryRepository = AppDataSource.getRepository(Category)

export const getNews = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = req.skip;

    const search = req.query.search
    const whereCondition: any[] = []
    if(search) {
        whereCondition.push({ title: Like(`%${search}%`) })
        whereCondition.push({ title: Like(`%${search}%`) })
    }

    const [news, total] = await newsRepository.findAndCount({
        where: whereCondition,
        select: {
            author: {
                id: true,
                first_name: true,
                last_name: true
            }
        },
        relations: { 
            author: true
        },
        skip: offset,
        take: limit,
    })

    res.json({ 
        news,
        meta: {
            total,
            pageCount: Math.ceil(total / limit),
            currentPage: parseInt(req.query.page as string, 10) || 1,
        }
    })
}

export const getSingleNews = async (req: Request, res: Response) => {
    const news = await newsRepository.findOne({ 
        where: { id: req.params.id as string },
        select: {
            author: {
                id: true,
                first_name: true,
                last_name: true
            }
        },
        relations: { author: true }
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    res.json({ news })
}

export const createNews = async (req: Request, res: Response) => {
    const user_id = req.userId
    const { title, text, category_id, tags } = req.body

    const category = await categoryRepository.findOne({ where: { id: category_id } })
    const author = await userRepository.findOne({ where: { id: user_id } })
    if(!category || !author) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    const news = newsRepository.create({ title, text })
    news.author = author
    news.category = category
    // tagovi
    const newsTags = await Promise.all(getTags(tags.split(',').map((item: string) => item.trim())))
    news.tags = newsTags

    const savedNews = await newsRepository.save(news)
    
    res.status(201).json({ news_id: savedNews.id })
}

export const updateNews = async (req: Request, res: Response) => {
    const { title, text, category_id, tags } = req.body

    const news = await newsRepository.findOne({ where: { id: req.params.id as string } })
    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    if(title) news.title = title
    if(text) news.text = text
    if(tags) {
        const newTags = await Promise.all(getTags(tags.split(',').map((item: string) => item.trim())))
        news.tags = newTags
    }
    if(category_id) {
        const category = await categoryRepository.findOne({ where: { id: category_id } })
        if(!category) {
            return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
        }
        news.category = category
    }

    const savedNews = await newsRepository.save(news)
    res.json({ news_id: savedNews.id })
}

export const deleteNews = async (req: Request, res: Response) => {
    const news = await newsRepository.findOne({ 
        where: { id: req.params.id as string },
        relations: {
            tags: true
        }
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    news.tags = []
    await newsRepository.remove(news)

    res.status(204).json({})
}