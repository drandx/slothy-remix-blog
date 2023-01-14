import { prisma } from "~/db.server";
export type { Post } from '@prisma/client';

export function getPosts() {
    return prisma.post.findMany({
        select: {
        title: true,
        slug: true,
        markdown: true,
        },
    });
}