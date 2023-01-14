import {json} from "@remix-run/node";

export default async function getPosts() {
    const posts = [
        {title: "My first post", slug: "my-first-post"},
        {title: "My second post", slug: "my-second-post"},
        {title: "My third post", slug: "my-third-post"}
    ];
    return json({posts})
}