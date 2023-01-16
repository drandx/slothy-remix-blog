import { Form } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { createPost } from "~/models/posts.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const action: ActionFunction = async ({ request }) => {
    const body = await request.formData();
    const title = body.get("title");
    const slug = body.get("slug");
    const markdown = body.get("markdown");
    await createPost({ title, slug, markdown });
    return redirect("/posts/admin");
};

export default function NewPostRoute() {
    return (
        <Form method="post">
          <p>
            <label>
              Post Title:
              <input
                type="text"
                name="title"
                className={inputClassName}
              />
            </label>
          </p>
          <p>
            <label>
              Post Slug:
              <input
                type="text"
                name="slug"
                className={inputClassName}
              />
            </label>
          </p>
          <p>
            <label htmlFor="markdown">
              Markdown:
            </label>
            <textarea
              id="markdown"
              rows={20}
              name="markdown"
              className={`${inputClassName} font-mono`}
            />
          </p>
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            >
                Create Post
            </button>
          </div>
        </Form>
      );
};
