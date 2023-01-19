import { Outlet } from "@remix-run/react";

export default function GetPosts() {
    return (<div>
        <Outlet/>
    </div>)
}

export function ErrorBoundary({ error }: { error: Error}) {
    return (
        <div className="text-red-500">
            Oh no, something went wrong!
            <pre>{error.message}</pre>
        </div>
    )
}