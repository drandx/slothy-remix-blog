import { Form, useActionData, useTransition } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { createPost } from "~/models/posts.server";
import invariant from "tiny-invariant";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

type ActionData = 
    | {
      title: string;
      slug: string;
      markdown: string;
    }
    | undefined;

export const action: ActionFunction = async ({ request }) => {
    const body = await request.formData();
    
    const title = body.get("title");
    const slug = body.get("slug");
    const markdown = body.get("markdown");

    const errors = {
        title: title ? null : "Title is required",
        slug: slug ? null : "Slug is required",
        markdown: markdown ? null : "Markdown is required",
    }
    
    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
    if (hasErrors) {
        return json(errors)
    }

    invariant(typeof title === 'string', "title is required");
    invariant(typeof slug === 'string', "slug is required");
    invariant(typeof markdown === 'string', "markdown is required");

    await createPost({ title, slug, markdown });
    
    return redirect("/posts/admin");
};

export default function NewPostRoute() {
    const errors = useActionData() as ActionData;
    const transition = useTransition();
    const isCreating = Boolean(transition.submission);
    return (
        <Form method="post">
          <p>
            <label>
              Post Title: {" "}
              {errors?.title ? (
                <em className="text-red-600">{errors.title}</em>
                ): null}
              <input
                type="text"
                name="title"
                className={inputClassName}
              />
            </label>
          </p>
          <p>
            <label>
              Post Slug: {" "}
              {errors?.slug ? (
                <em className="text-red-600">{errors.slug}</em>
                ): null}
              <input
                type="text"
                name="slug"
                className={inputClassName}
              />
            </label>
          </p>
          <p>
            <label htmlFor="markdown">
              Post Markdown: {" "}
              {errors?.markdown ? (
                <em className="text-red-600">{errors.markdown}</em>
                ): null}
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
              disabled={isCreating}
              className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            >
                {isCreating ? "Creating..." : "Create Post"}
            </button>
          </div>
        </Form>
      );
};
