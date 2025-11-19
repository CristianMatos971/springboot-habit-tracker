import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
            <Link to="/">
                <h1 className="text-xl font-bold text-blue-600">
                    Matt's Habit Tracker
                </h1>
            </Link>

            <nav className="flex gap-4 items-center">

                {!isAuthenticated && (
                    <>
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
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <span className="text-gray-700">
                            Hello, {user?.name || "User"}
                        </span>

                        <button
                            onClick={logout}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
