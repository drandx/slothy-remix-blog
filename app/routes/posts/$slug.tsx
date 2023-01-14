import { useLoaderData } from "@remix-run/react";
import { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getPost } from "~/models/posts.server";

export async function loader({params}: LoaderArgs) {
    const slug = params.slug;
    const post = await getPost(slug);
    return json(post);
}

export default function PostRoute () {
    const data = useLoaderData();
    return (
        <main>
            <h1>{data.title}</h1>
            <p>{data.body}</p>
        </main>
    );
}