import express from 'express'
import catchAsync from '../utilities/catchAsync'
import { getSingleTag } from '../controllers/tagController'

const router = express.Router()

router.get('/:id', catchAsync(getSingleTag))

export default router