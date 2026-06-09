import { AppDataSource } from "../data-source";
import { Tag } from "../entities/Tag";
import { Request, Response } from "express";

const tagRepository = AppDataSource.getRepository(Tag)

export const getSingleTag = async (req: Request, res: Response) => {
    const tag = await tagRepository.findOne({ 
        where: { id: req.params.id as string },
    })

    if(!tag) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    res.json({ tag })
}