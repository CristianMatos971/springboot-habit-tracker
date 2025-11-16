import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
            <a href="/">
                <h1 className="text-xl font-bold text-blue-600">
                    Matt's Habit Tracker
                </h1>
            </a>
            <nav className="flex gap-4">
                <Link
                    to="/login"
                    className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                    Login
                </Link>

                <Link
                    to="/register"
                    className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                    Register
                </Link>
            </nav>
        </header>
    );
}

export default Header;
