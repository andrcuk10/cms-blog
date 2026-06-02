import { z } from "zod";

export const newsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    text: z.string().min(1, 'Text is required'),
    category_id: z.string().min(1, 'category_id is required'),
    tags: z.string()
        .regex(/^[^,]+(,\s*[^,]+)*$/, {
            message: 'Invalid format: must be comma-separated. Example: item1, item2, item3'
        })
    // tags: z.string().min(1, 'Tags is required')
})

export const updateNewsSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    text: z.string().min(1, 'Text is required').optional(),
    category_id: z.string().min(1, 'category_id is required').optional(),
    tags: z.string()
        .regex(/^[^,]+(,\s*[^,]+)*$/, {
            message: 'Invalid format: must be comma-separated. Example: item1, item2, item3'
        })
        .optional()
    // tags: z.string().min(1, 'Tags is required').optional()
})