import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
            <p className="text-gray-500 mt-2">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="mt-4 text-blue-500 underline">Go to Dashboard</Link>
        </div>
    );
}
