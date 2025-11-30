import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="w-full flex flex-col">
            {!isAuthenticated && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs sm:text-sm py-2 px-4 text-center font-medium transition-colors duration-300">
                    <span>
                        <strong>Demo Notice:</strong> This project runs on a free tier hosting.
                        The server sleeps when inactive, so the first request may take up to 60s.
                    </span>
                </div>
            )}

            <header className="w-full bg-white dark:bg-gray-900 border-b border-transparent dark:border-gray-800 shadow-sm py-4 px-8 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
                <Link to="/">
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight transition-colors">
                        Matt's Habit Tracker
                    </h1>
                </Link>

                <nav className="flex gap-4 items-center">

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === 'dark' ? (
                            /* Ícone de SOL */
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        ) : (
                            /* Ícone de LUA */
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        )}
                    </button>

                    {/* LINKS DE AUTH */}
                    {!isAuthenticated && (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-sm"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {isAuthenticated && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                                Hello, {user ? user.name : "User"}
                            </span>

                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </header>
        </div>
    );
}

export default Header;