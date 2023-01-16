import { Link } from "@remix-run/react";
import TmpComponent from "./TmpComponent";

export default function AdminIndexRoute() {
    return (
        <div>
            <p>
                <Link to="new" className="text-blue-600 underline">
                    Cerate a New Post
                </Link>
            </p>
            <TmpComponent/>
        </div>
    );
}