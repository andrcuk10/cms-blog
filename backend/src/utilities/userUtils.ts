import { User } from "../entities/User";

// vraca korisnika bez password
export function getUserDto(user: User) {
    const { password, ...userDto } = user

    return userDto
}