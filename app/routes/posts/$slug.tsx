import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getPost } from "~/models/posts.server";
import { marked } from 'marked';
import invariant from "tiny-invariant";
import { requireAdminUser } from "~/session.server";

type LoaderData = {
    title: string;
    html: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const slug = params.slug;
    invariant(slug, "slug is required");
    const post = await getPost(slug);
    invariant(post, `post not found: ${slug}`);
    const html = marked(post.markdown);
    const title = post.title;
    return json<LoaderData>({ title, html });
}

export default function PostRoute () {
    const { title, html } = useLoaderData() as LoaderData;
    return (
        <main className="mx-auto max-w-4xl">
            <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </main>
    );
}