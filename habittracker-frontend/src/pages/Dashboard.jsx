import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import PomodoroCard from "../components/PomodoroCard";
import HabitCard from "../components/HabitCard";
import TasksCard from "../components/TasksCard";
import AuthGuard from "../components/AuthGuard";

function Dashboard() {
    const { isAuthenticated } = useAuth();
    return (
        <>
            <Header />

            {!isAuthenticated && (
                <div className="bg-gray-50 dark:bg-gray-900/30 border-b border-blue-100 dark:border-blue-800 text-white-800 dark:text-white-200 text-sm sm:text-sm py-2 px-4 text-center font-medium transition-colors duration-300">
                    <span>
                        When using those functionalities, your data will be stored only in your browser (RAM). To save your data permanently, please <a href="/login"> <strong>Login or Register yourself</strong></a>
                    </span>
                </div>
            )}

            <div className="p-10 grid grid-cols-1 md:grid-cols-5 gap-8 dark:bg-gray-900">

                <div className="md:col-span-1">
                    <PomodoroCard />
                </div>

                <div className="md:col-span-3">
                    <HabitCard />
                </div>

                <div className="md:col-span-1">
                    <TasksCard />
                </div>

            </div>
        </>
    );
}

export default Dashboard;
