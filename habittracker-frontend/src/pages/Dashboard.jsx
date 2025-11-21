import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import PomodoroCard from "../components/PomodoroCard";
import HabitCard from "../components/HabitCard";
import TasksCard from "../components/TasksCard";
import AuthGuard from "../components/AuthGuard";

function Dashboard() {
    return (
        <>
            <Header />

            <div className="m-10 grid grid-cols-1 md:grid-cols-4 gap-8">

                <div className="md:col-span-1">
                    <PomodoroCard />
                </div>

                <div className="md:col-span-2">
                    <AuthGuard>
                        <HabitCard />
                    </AuthGuard>
                </div>

                <div className="md:col-span-1">
                    <AuthGuard>
                        <TasksCard />
                    </AuthGuard>
                </div>

            </div>
        </>
    );
}

export default Dashboard;
