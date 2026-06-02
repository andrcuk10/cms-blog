import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import bcrypt from "bcryptjs"
import { User } from "../entities/User"
import { generateToken } from "./jwtUtils"

export const login = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)
    const { email, password } = req.body // podaci iz zahteva
    
    const user = await userRepository.findOneBy({ email: email })
    if(!user) {
        return res.status(400).json({ code: 'INCORRECT_CREDENTIALS' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
        return res.status(400).json({ code: 'INCORRECT_CREDENTIALS' })
    }

    const token = generateToken(user.id, user.role)
    res.json({ token })
}