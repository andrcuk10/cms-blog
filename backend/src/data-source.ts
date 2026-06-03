import { DataSource } from 'typeorm'
import { User } from './entities/User'
import { Category } from './entities/Category'
import { Comment } from './entities/Comment'
import { News } from './entities/News'
import { Tag } from './entities/Tag'

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "192.168.1.226",
    port: 3306,
    username: "andrija",
    password: "andrija",
    database: "webproject",
    synchronize: true,
    logging: true,
    entities: [User, Category, Comment, News, Tag], // './entities/*.ts' ili .js
    subscribers: [],
    migrations: [],
})