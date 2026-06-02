import express from 'express'
import { createUser, getUser, getUsers, updateUser, updateUserStatus } from '../controllers/userController'
import { authenticate } from '../auth/authMiddleware'
import { authorizeUser } from '../middlewares/authorizeUser'
import { validate } from '../middlewares/validate'
import { updateUserSchema, userSchema } from '../schemas/userSchema'
import catchAsync from '../utilities/catchAsync'

const router = express.Router()

router.get('/', authenticate, authorizeUser, catchAsync(getUsers))
router.get('/:id', authenticate, authorizeUser, catchAsync(getUser))
router.post('/', authenticate, authorizeUser, validate(userSchema), catchAsync(createUser))
router.patch('/:id', authenticate, authorizeUser, validate(updateUserSchema), catchAsync(updateUser))
router.get('/:id/status', authenticate, authorizeUser, catchAsync(updateUserStatus))

export default router