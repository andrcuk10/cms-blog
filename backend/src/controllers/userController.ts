import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User, UserRole } from "../entities/User"
import { getUserDto } from "../utilities/userUtils"
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User)

export const getUsers = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = req.skip;

    const [allUsers, total] = await userRepository.findAndCount({
        skip: offset,
        take: limit,
    })

    const users = allUsers.map(user => getUserDto(user))

    res.json({ 
        users,
        meta: {
            total,
            pageCount: Math.ceil(total / limit),
            currentPage: parseInt(req.query.page as string, 10) || 1,
        }
    })
}

export const getUser = async (req: Request, res: Response) => {
    const user_id = req.params.id

    const specificUser = await userRepository.findOneBy({ id: user_id as string })

    if(!specificUser) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    const user = getUserDto(specificUser)

    res.json({ user })
}

export const createUser = async (req: Request, res: Response) => {
    const { email, first_name, last_name, role, status, password } = req.body

    const user = await userRepository.findOne({ where: { email }})
    if(user) {
        return res.status(400).json({ code: "DUPLICATE_EMAIL" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = userRepository.create({ email, first_name, last_name, role, status, password: hashedPassword })
    const savedUser = await userRepository.save(newUser)

    res.status(201).json({ user_id: savedUser.id })
}

export const updateUser = async (req: Request, res: Response) => {
    const { email, first_name, last_name, role, status } = req.body
    
    const user = await userRepository.findOne({ where: { id: req.params.id as string } })
    if(!user) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    if(email) user.email = email
    if(first_name) user.first_name = first_name
    if(last_name) user.last_name = last_name
    if(role) user.role = role
    if(status) user.status = status

    const updatedUser = await userRepository.save(user)

    res.json({ user_id: updatedUser.id })
}

export const updateUserStatus = async (req: Request, res: Response) => {
    const user = await userRepository.findOne({ where: { id: req.params.id as string } })
    if(!user) {
        return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
    }

    if(user.role !== UserRole.ADMIN) user.status = !user.status

    await userRepository.save(user)

    res.json({ user_id: user.id, status: user.status })
}