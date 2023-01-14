import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getPost } from "~/models/posts.server";

type LoaderData = {
    post: Awaited<ReturnType<typeof getPost>>;
}

export const loader: LoaderFunction = async ({ params }) => {
    const slug = params.slug;
    const post = await getPost(slug);
    return json<LoaderData>({ post });
}

export default function PostRoute () {
    const { post } = useLoaderData() as LoaderData;
    return (
        <main className= "mx-auto max-w-4x1">
            <h1 className="my-6 border-b-2 text-center text-3x1">{post?.title}</h1>
            <p>{post?.markdown}</p>
        </main>
    );
}