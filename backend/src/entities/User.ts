import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { News } from "./News";

export enum UserRole {
    ADMIN = 'admin',
    CREATOR = 'creator'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CREATOR,
    })
    role: UserRole

    @Column()
    status: boolean

    @Column() // cuva se hesirana vrednost
    password: string

    @OneToMany(() => News, (news) => news.author)
    news: Relation<News[]>
}