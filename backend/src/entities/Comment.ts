import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { News } from "./News";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    author: string

    @Column('text')
    text: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @ManyToOne(() => News, (news) => news.comments)
    news: Relation<News>
}