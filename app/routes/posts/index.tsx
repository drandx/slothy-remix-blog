// Import the Link component from remix/react
import { Link, useLoaderData } from "@remix-run/react";
// Import json from remix/node
import { json } from "@remix-run/node";

export const loader = async () => {
    const posts = [
        {title: "My first post", slug: "my-first-post"},
        {title: "My second post", slug: "my-second-post"},
        {title: "My third post", slug: "my-third-post"}
    ];
    return json({posts})
}

export default function PostsRoute() {
    const { posts } = useLoaderData()
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