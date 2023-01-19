import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { createPost, deletePost, getPost, updatePost } from "~/models/posts.server";
import invariant from "tiny-invariant";
import { requireAdminUser } from "~/session.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

type ActionData = 
    | {
      title: string;
      slug: string;
      markdown: string;
    }
    | undefined;

export const loader: LoaderFunction = async ({ params }) => {
      // Return empty json if slug is new
      if (params.slug === "new") {
        return json({});
      }
      invariant(params.slug, "slug is required");
      const post = await getPost(params.slug);
      return json({ post });
};

export const action: ActionFunction = async ({ request, params }) => {
    await requireAdminUser(request);
    const formData = await request.formData();
    const intent = formData.get("intent");
    
    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");

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

    if(intent === "delete") {
      await deletePost(slug);
      return redirect("/posts/admin");
    }

    // Create the post if it's new
    if (params.slug === "new") {
      await createPost({ title, slug, markdown });
    } else {
      invariant(params.slug, "slug is required");
      await updatePost(params.slug, { title, slug, markdown });
    }

    
    return redirect("/posts/admin");
};

export default function NewPostRoute() {
    const { post } = useLoaderData();
    const errors = useActionData() as ActionData;
    const transition = useTransition();
    const isCreating = Boolean(transition.submission);
    const isUpdating = Boolean(transition.submission);
    const isDeleting = Boolean(transition.submission);
    const isNewPost = !post;
    return (
        <Form method="post" key={post?.slug ?? "new"}>
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
                defaultValue={post?.title}
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
                defaultValue={post?.slug}
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
              defaultValue={post?.markdown}
            />
          </p>
          <div className="flex justify-end gap-4">
            {isNewPost ? null : (
              <button
                type="submit"
                name="intent"
                value={"delete"}
                disabled={isDeleting}
                className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
              >
                  {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
            <button
              type="submit"
              name="intent"
              value={isNewPost ? "create" : "update"}
              disabled={isCreating || isUpdating}
              className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            >
                {isNewPost ? (isCreating ? "Creating..." : "Create Post") : (isUpdating ? "Updating..." : "Update Post")}
            </button>
          </div>
        </Form>
      );
};
