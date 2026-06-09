import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { News } from "../entities/News";
import { User } from "../entities/User";
import { Category } from "../entities/Category";
import { getTags } from "./tagsController";
import { Like, MoreThanOrEqual } from "typeorm";
import { Comment } from "../entities/Comment";

const newsRepository = AppDataSource.getRepository(News)
const userRepository = AppDataSource.getRepository(User)
const categoryRepository = AppDataSource.getRepository(Category)
const commentRepository = AppDataSource.getRepository(Comment)

export const getNews = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = req.skip;

    const search = req.query.search
    const category = req.query.categoryId

    let whereCondition: any = [];

    if (search && category) {
        whereCondition = [
            { title: Like(`%${search}%`), category: { id: category } },
            { text: Like(`%${search}%`), category: { id: category } },
        ];
    } else if (search) {
        whereCondition = [
            { title: Like(`%${search}%`) },
            { text: Like(`%${search}%`) },
        ];
    } else if (category) {
        whereCondition = { category: { id: category } };
    }

    const [news, total] = await newsRepository.findAndCount({
        where: whereCondition,
        order: {
            createdAt: "DESC"
        },
        select: {
            author: {
                id: true,
                first_name: true,
                last_name: true
            }
        },
        relations: { 
            author: true,
            tags: true,
            category: true,
            comments: true
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
        relations: { author: true, tags: true, category: true, comments: true }
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    res.json({ news })
}

export const getMostReacted = async (req: Request, res: Response) => {
    const news = await newsRepository
        .createQueryBuilder("news")
        .select(["news.id", "news.title"])
        .addSelect("news.like + news.dislike", "reactions")
        .orderBy("reactions", "DESC")
        .limit(3)
        .getMany();

    res.json({ news });
}

export const filterByTag = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = req.skip;

    const tagId = req.query.tag as string

    const [news, total] = await newsRepository.findAndCount({ 
        where: {
            tags: {
                id: tagId
            }
        },
        select: {
            author: {
                id: true,
                first_name: true,
                last_name: true
            }
        },
        relations: { author: true, tags: true, category: true, comments: true },
        skip: offset,
        take: limit,
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    res.json({ 
        news,
        meta: {
            total,
            pageCount: Math.ceil(total / limit),
            currentPage: parseInt(req.query.page as string, 10) || 1,
        }
    })
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
            tags: true,
            comments: true
        }
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    news.tags = []
    news.comments = []
    await newsRepository.remove(news)

    res.status(204).json({})
}

export const createComment = async (req: Request, res: Response) => {
    const { author, text } = req.body

    const news = await newsRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    const comment = commentRepository.create({ author, text })
    comment.news = news
    const savedComment = await commentRepository.save(comment)

    res.status(201).json({ comment_id: savedComment.id })
}

export const likeComment = async (req: Request, res: Response) => {
    const comment = await commentRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!comment) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    comment.like = ++comment.like
    const savedComment = await commentRepository.save(comment)

    res.status(201).json({ comment_id: savedComment.id, like: savedComment.like })
}

export const dislikeComment = async (req: Request, res: Response) => {
    const comment = await commentRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!comment) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    comment.dislike = ++comment.dislike
    const savedComment = await commentRepository.save(comment)

    res.status(201).json({ comment_id: savedComment.id, dislike: savedComment.dislike })
}

export const visitNews = async (req: Request, res: Response) => {
    const news = await newsRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    news.visits = ++news.visits
    const savedNews = await newsRepository.save(news)

    res.status(201).json({ comment_id: savedNews.id, visit: savedNews.visits })
}

export const likeNews = async (req: Request, res: Response) => {
    const news = await newsRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    news.like = ++news.like
    const savedNews = await newsRepository.save(news)

    res.status(201).json({ news_id: savedNews.id, like: savedNews.like })
}

export const dislikeNews = async (req: Request, res: Response) => {
    const news = await newsRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!news) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    news.dislike = ++news.dislike
    const savedNews = await newsRepository.save(news)

    res.status(201).json({ news_id: savedNews.id, dislike: savedNews.dislike })
}

export const mostViewed = async (req: Request, res: Response) => {
    console.log('USAO U MOSTVIEWED')
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mostReadNews = await newsRepository.find({
        where: {
            createdAt: MoreThanOrEqual(thirtyDaysAgo),
        },
        order: {
            visits: 'DESC',
        },
        relations: {
            category: true
        },
        take: 10,
    });

    return res.json({ news: mostReadNews })
}