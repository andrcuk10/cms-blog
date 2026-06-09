import express from 'express'
import { createNews, deleteNews, getNews, getSingleNews, mostViewed, updateNews, likeNews, dislikeNews, visitNews, createComment, likeComment, dislikeComment } from '../controllers/newsController'
import { authenticate } from '../auth/authMiddleware'
import { authorizeNews } from '../middlewares/authorizeUser'
import { validate } from '../middlewares/validate'
import { newsSchema, updateNewsSchema } from '../schemas/newsSchema'
import catchAsync from '../utilities/catchAsync'
import { commentSchema } from '../schemas/commentSchema'

const router = express.Router()

router.get('/', catchAsync(getNews))
router.get('/most-viewed', catchAsync(mostViewed))
router.get('/:id', catchAsync(getSingleNews))
router.post('/', authenticate, validate(newsSchema), catchAsync(createNews))
router.post('/:id/visit', catchAsync(visitNews))
router.post('/:id/like', catchAsync(likeNews))
router.post('/:id/dislike', catchAsync(dislikeNews))
router.patch('/:id', authenticate, authorizeNews, validate(updateNewsSchema), catchAsync(updateNews))
router.delete('/:id', authenticate, authorizeNews, catchAsync(deleteNews))

router.post('/:id/comments', validate(commentSchema), catchAsync(createComment))
router.post('/comments/:id/like', catchAsync(likeComment))
router.post('/comments/:id/dislike', catchAsync(dislikeComment))

export default router