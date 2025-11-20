import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Home() {
    const { user, isAuthenticated } = useAuth();
    console.log("Home user:", user);
    return (
        <>
            <Header />

            <div className="px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-800">
                    Welcome {user?.name ?? "Guest"}!
                </h2>

                <div className="mt-4">
                    <Link
                        to="/Dashboard"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {isAuthenticated ? "Go to Dashboard" : "Get Started Testing"}
                    </Link>
                </div>
                <p className="mt-4 text-gray-600 max-w-xl">
                    Organize tasks, track habits, follow Pomodoro focus sessions and more.
                </p>
            </div>
        </>
    );
}

export default Home;
