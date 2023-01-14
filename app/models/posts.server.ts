import { prisma } from "~/db.server";
export type { Post } from '@prisma/client';

export function getPostsListings() {
    return prisma.post.findMany({
        select: {
        title: true,
        slug: true,
        markdown: true,
        },
    });
}

export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}