import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BarChart3, Clock, CheckSquare, Layout } from "lucide-react";

function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="px-6 py-16 max-w-5xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Welcome{user ? `, ${user.name}` : ""}!
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        This platform helps you build consistency and stay productive.
                        Track your habits, organize your tasks, and stay focused — all in one clean dashboard.
                    </p>

                    <div className="mt-10">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            {isAuthenticated ? "Go to Dashboard" : "Start Using the App"}
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <FeatureCard
                        icon={<BarChart3 className="w-6 h-6 text-indigo-600" />}
                        title="Habit Tracking"
                        description="Build streaks, visualize your progress with a heatmap, and set goals that help you stay consistent day-after-day."
                    />

                    <FeatureCard
                        icon={<Clock className="w-6 h-6 text-indigo-600" />}
                        title="Pomodoro Focus"
                        description="Stay productive using a customizable Pomodoro timer with automatic cycles, alarms, and break management."
                    />

                    <FeatureCard
                        icon={<CheckSquare className="w-6 h-6 text-indigo-600" />}
                        title="Task Management"
                        description="Create, edit, and track tasks with deadlines and visual indicators for overdue items so you never miss a thing."
                    />

                    <FeatureCard
                        icon={<Layout className="w-6 h-6 text-indigo-600" />}
                        title="Productivity Hub"
                        description="Your tasks, habits, focus sessions, and progress history — all centralized in a simple and efficient interface."
                    />
                </div>
            </main>
        </div>
    );
}

// Componente interno para evitar repetição de código e manter o design limpo
function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
                {title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

export default Home;