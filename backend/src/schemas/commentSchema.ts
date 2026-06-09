import { z } from "zod";

export const commentSchema = z.object({
    author: z.string().min(1, "Author is required"),
    text: z.string().min(1, "Comment body is required"),
})