import express from 'express'
import cors from 'cors'
import 'reflect-metadata'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import newsRoutes from './routes/newsRoutes'
import { AppDataSource } from './data-source'
import paginate from 'express-paginate'
import errorHandler from './middlewares/errorHandler'

const app = express()
app.use(cors())
app.use(express.json())
app.use(paginate.middleware(10, 25))

AppDataSource.initialize()
    .then(() => {
        const port = 3000
        console.log('Baza podataka je uspesno povezana!')

        app.use('/users', userRoutes)
        app.use('/auth', authRoutes)
        app.use('/categories', categoryRoutes)
        app.use('/news', newsRoutes)

        app.use(errorHandler)
        
        app.listen(port, () => {
            console.log(`Server je pokrenut na http://localhost:${port}`)
        })
    })
    .catch((error) => {
        console.log(`Greska prilikom povezivanja sa bazom: ${error}`)
    })
