import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Comment } from "./Comment";
import { Tag } from "./Tag";

@Entity()
export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column('text')
    text: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @Column({ default: 0 })
    visits: number

    @ManyToOne(() => User, (author) => author.news, {
        cascade: true
    })
    author: Relation<User>

    @ManyToOne(() => Category, (category) => category.news, {
        cascade: true
    })
    category: Relation<Category>

    @OneToMany(() => Comment, (comment) => comment.news, {
        cascade: true
    })
    comments: Relation<Comment[]>

    @ManyToMany(() => Tag, (tags) => tags.news, {
        cascade: true
    })
    @JoinTable()
    tags: Relation<Tag[]>
}