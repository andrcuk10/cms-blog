import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { News } from "./News";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    name: string

    @ManyToMany(() => News, (news) => news.tags)
    news: Relation<News[]>
}