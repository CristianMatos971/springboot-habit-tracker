import { useState } from "react";

function PomodoroCard() {
    const [time, setTime] = useState(25 * 60);

    return (
        <div className="min-h-[700px] bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-2 border-indigo-600">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Pomodoro Timer</h2>

            <div className="text-5xl font-semibold text-purple-600 mb-6">
                {String(Math.floor(time / 60)).padStart(2, "0")}:
                {String(time % 60).padStart(2, "0")}
            </div>

            <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                    Start
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
                    Pause
                </button>
                <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                    Reset
                </button>
            </div>

            <button className="mt-4 text-sm text-purple-600 hover:underline">
                Configurate Options
            </button>
        </div>
    );
}

export default PomodoroCard;
