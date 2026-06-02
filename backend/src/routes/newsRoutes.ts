import express from 'express'
import { createNews, deleteNews, getNews, getSingleNews, updateNews } from '../controllers/newsController'
import { authenticate } from '../auth/authMiddleware'
import { authorizeNews } from '../middlewares/authorizeUser'
import { validate } from '../middlewares/validate'
import { newsSchema, updateNewsSchema } from '../schemas/newsSchema'
import catchAsync from '../utilities/catchAsync'

const router = express.Router()

router.get('/', catchAsync(getNews))
router.get('/:id', catchAsync(getSingleNews))
router.post('/', authenticate, validate(newsSchema), catchAsync(createNews))
router.patch('/:id', authenticate, authorizeNews, validate(updateNewsSchema), catchAsync(updateNews))
router.delete('/:id', authenticate, authorizeNews, catchAsync(deleteNews))

export default router