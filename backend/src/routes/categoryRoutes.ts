import express from 'express'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryController'
import { authenticate } from '../auth/authMiddleware'
import { validate } from '../middlewares/validate'
import { categorySchema, updateCategorySchema } from '../schemas/catrogorySchema'
import catchAsync from '../utilities/catchAsync'

const router = express.Router()

router.get('/', catchAsync(getCategories))
router.get('/:id', catchAsync(getCategory))
router.post('/', authenticate, validate(categorySchema), catchAsync(createCategory))
router.patch('/:id', authenticate, validate(updateCategorySchema), catchAsync(updateCategory))
router.delete('/:id', authenticate, catchAsync(deleteCategory))

export default router