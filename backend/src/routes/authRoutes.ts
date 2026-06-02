import express from 'express'
import { login } from '../auth/authController'
import { validate } from '../middlewares/validate'
import { loginSchema } from '../schemas/authSchema'
import catchAsync from '../utilities/catchAsync'

const router = express.Router()

router.post('/login', validate(loginSchema), catchAsync(login))

export default router