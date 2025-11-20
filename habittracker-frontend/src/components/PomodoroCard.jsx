import { useState, useEffect, useRef } from "react";
import alarmFile from "../assets/sounds/alarm.mp3";

function PomodoroCard() {
    const FOCUS_TIME = 25 * 60;
    const REST_TIME = 5 * 60;

    const [mode, setMode] = useState("focus");
    const [time, setTime] = useState(FOCUS_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [autoSkip, setAutoSkip] = useState(false);
    const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

    const alarmRef = useRef(null);
    const alarmInterval = useRef(null);

    useEffect(() => {
        alarmRef.current = new Audio(alarmFile);
        alarmRef.current.loop = false;
    }, []);

    useEffect(() => {
        let interval = null;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        }

        if (time === 0 && isRunning) {
            setIsRunning(false);
        }

        return () => clearInterval(interval);
    }, [isRunning, time]);

    useEffect(() => {
        if (time === 0 && !isRunning) {
            setIsAlarmPlaying(true);

            alarmRef.current.currentTime = 0;
            alarmRef.current.play();

            alarmInterval.current = setInterval(() => {
                alarmRef.current.currentTime = 0;
                alarmRef.current.play();
            }, 2000);

            if (autoSkip) {
                const next = mode === "focus" ? "rest" : "focus";
                const nextTime = next === "focus" ? FOCUS_TIME : REST_TIME;

                setTimeout(() => {
                    clearInterval(alarmInterval.current);
                    alarmRef.current.pause();
                    setMode(next);
                    setTime(nextTime);
                    setIsRunning(false);
                }, 3000);
            }
        }

        return () => {
            clearInterval(alarmInterval.current);
        };
    }, [time, isRunning, autoSkip, mode]);

    const stopAlarm = () => {
        clearInterval(alarmInterval.current);
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
        setIsAlarmPlaying(false);
    };

    const toggleTimer = () => {
        stopAlarm();
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        stopAlarm();
        setIsRunning(false);
        setTime(mode === "focus" ? FOCUS_TIME : REST_TIME);
    };

    const handleSkip = () => {
        stopAlarm();
        setIsRunning(false);

        const next = mode === "focus" ? "rest" : "focus";
        setMode(next);

        const nextTime = next === "focus" ? FOCUS_TIME : REST_TIME;
        setTime(nextTime);
    };

    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    return (
        <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 border-2 border-indigo-600">

            <div className="flex flex-col items-center gap-2">
                <h2 className={`text-xl font-bold uppercase tracking-widest ${mode === "focus" ? "text-indigo-600" : "text-green-600"}`}>
                    {mode === "focus" ? "Focus Time" : "Rest Time"}
                </h2>

                <div className="text-x2 font-bold uppercase tracking-widest text-indigo-800">
                    <input type="checkbox" onChange={(e) => setAutoSkip(e.target.checked)} /> Auto Skip Alarms?
                </div>

                <div className="text-7xl font-bold text-gray-800 tracking-tighter">
                    {minutes}:{seconds}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full justify-center">
                <button
                    onClick={toggleTimer}
                    className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-md w-28 hover:scale-105 ${isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                    {isRunning ? "Pause" : "Start"}
                </button>

                <button
                    onClick={handleSkip}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors
                    ${isAlarmPlaying ? "bg-red-600 text-white border-red-700 hover:bg-red-700" : "text-indigo-700 bg-indigo-50 border-2 border-indigo-100 hover:bg-indigo-100"}`}
                >
                    Skip
                </button>

                <button
                    onClick={handleReset}
                    className="px-4 py-3 rounded-lg font-semibold text-gray-500 bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            <button className="w-full py-3 rounded-lg bg-slate-800 text-gray-100 font-medium hover:bg-slate-900 transition-all shadow-sm flex items-center justify-center gap-2">
                <span>⚙️</span> Configure Options
            </button>
        </div>
    );
}

export default PomodoroCard;
