import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { News } from "./News";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    name: string

    @Column('text')
    description: string

    @OneToMany(() => News, (news) => news.category)
    news: Relation<News[]>
}