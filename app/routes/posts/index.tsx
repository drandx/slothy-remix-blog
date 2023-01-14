// Import the Link component from remix/react
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { getPosts } from "~/models/posts.server";
// Import the json helper from remix
import { json } from "@remix-run/node";

type LoaderData = {
    posts: Awaited<ReturnType<typeof getPosts>>;
}

export const loader: LoaderFunction = async () => {
    const posts = await getPosts();
    return json<LoaderData>({ posts });
}

export default function PostsRoute() {
    const { posts } = useLoaderData() as LoaderData;
    return (
        <main>
            <h1>Posts</h1>
            <ul>
                {posts.map((post ) => (
                    <li key={post.slug}>
                        <Link to={post.slug} className="text-blue-600 underline">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}