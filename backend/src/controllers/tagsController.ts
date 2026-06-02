import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Tag } from "../entities/Tag";

const tagRepository = AppDataSource.getRepository(Tag)

export const getTags = (tags: string[]) => {
    return tags.map(async (tag) => await getTag(tag))
}

export const getTag = async (tag: string) => {
    const tagExist = await tagRepository.findOne({ where: { name: tag } })

    if(!tagExist) {
        const newTag = tagRepository.create({ name: tag })
        const savedTag = await tagRepository.save(newTag)

        return savedTag
    }

    return tagExist
}
