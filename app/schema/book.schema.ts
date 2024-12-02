import { z } from 'zod';

export const BookSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    info: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().or(z.null()),
    author: z.object({
      name: z.string(),
      bio: z.string(),
    }),
    genres: z.array(
      z
        .object({
          name: z.string(),
          description: z.string(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

export type Book = z.infer<typeof BookSchema>;
