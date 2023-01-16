import { prisma } from "~/db.server";
import type { Post } from '@prisma/client';

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

export async function createPost(post: Pick<Post, 'title' | 'slug' | 'markdown'>) {
    return prisma.post.create({ data: post });
}