// Import the Link component from remix/react
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { getPostsListings } from "~/models/posts.server";
// Import the json helper from remix
import { json } from "@remix-run/node";
import { userOptionalAdminUser } from "~/utils";

type LoaderData = {
    posts: Awaited<ReturnType<typeof getPostsListings>>;
}

export const loader: LoaderFunction = async () => {
    const posts = await getPostsListings();
    return json<LoaderData>({ posts });
}

export default function PostsRoute() {
    const { posts } = useLoaderData() as LoaderData;
    const adminUser = userOptionalAdminUser();
    return (
        <main>
            <h1>Posts</h1>
            {adminUser && (
            <Link to="admin" className="text-red-600 underline">
                Admin
            </Link>)
            }   
            <ul>
                {posts.map((post ) => (
                    <li key={post.slug}>
                        <Link 
                            prefetch="intent"
                            to={post.slug} 
                            className="text-blue-600 underline">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}