import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <>
            <Header />

            <div className="px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-800">
                    Welcome {user?.name ?? "Guest"}!
                </h2>

                <p className="mt-4 text-gray-600 max-w-xl">
                    Organize tasks, track habits, follow Pomodoro focus sessions and more.
                </p>
            </div>
        </>
    );
}

export default Home;
