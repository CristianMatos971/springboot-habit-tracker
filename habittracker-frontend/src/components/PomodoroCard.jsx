import { useState, useEffect, useRef } from "react";
import alarmFile from "../assets/sounds/alarm.mp3";
import PomodoroOptionsCard from "./PomodoroOptionsCard";

export default function PomodoroCard() {
    //CONFIGURAÇÕES PADRÃO 
    const DEFAULT_FOCUS = 25;
    const DEFAULT_REST = 5;
    const DEFAULT_LONG_REST = 15;

    // ESTADOS
    const [mode, setMode] = useState("focus"); // 'focus', 'rest', 'longRest'
    const [isRunning, setIsRunning] = useState(false);
    const [autoSkip, setAutoSkip] = useState(false);
    const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(0);

    // Configurações
    const [focusTime, setFocusTime] = useState(() => getSavedSettings("focusTime", DEFAULT_FOCUS));
    const [restTime, setRestTime] = useState(() => getSavedSettings("restTime", DEFAULT_REST));
    const [longRestTime, setLongRestTime] = useState(() => getSavedSettings("longRestTime", DEFAULT_LONG_REST));
    const [cycles, setCycles] = useState(() => getSavedSettings("cycles", 4));
    const [alarmVolume, setAlarmVolume] = useState(() => getSavedSettings("alarmVolume", 0.5));

    // O tempo inicial
    const [time, setTime] = useState(() => {
        const savedFocus = getSavedSettings("focusTime", DEFAULT_FOCUS);
        return savedFocus * 60;
    });

    // Refs para Áudio e Intervalos
    const alarmRef = useRef(new Audio(alarmFile));
    const autoSkipTimeoutRef = useRef(null);

    useEffect(() => {
        alarmRef.current.loop = true;
    }, []);

    useEffect(() => {
        alarmRef.current.volume = alarmVolume;
    }, [alarmVolume]);

    //Se as Configs mudarem e o timer estiver pausado, useEffect para atualizá-las
    useEffect(() => {
        if (!isRunning) {
            if (mode === "focus") setTime(focusTime * 60);
            if (mode === "rest") setTime(restTime * 60);
            if (mode === "longRest") setTime(longRestTime * 60);
        }

    }, [focusTime, restTime, longRestTime, mode]);

    //Salvar Configurações no LocalStorage
    useEffect(() => {
        const configs_pomodoro = {
            focusTime,
            restTime,
            longRestTime,
            cycles,
            alarmVolume
        };

        localStorage.setItem("configs_pomodoro", JSON.stringify(configs_pomodoro));

    }, [focusTime, restTime, longRestTime, cycles, alarmVolume]);

    //Lógica do Timer
    useEffect(() => {
        let interval = null;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        } else if (time === 0 && isRunning) {
            setIsRunning(false);
            playAlarm();
        }

        return () => clearInterval(interval);
    }, [isRunning, time]);

    //Use effect para atualizar o título da página seguindo o timer.
    useEffect(() => {
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");

        let modeLabel = "Focus";
        if (mode === "rest") modeLabel = "Break";
        if (mode === "longRest") modeLabel = "Long Break";

        // Atualiza o título do navegador (ex: 24:59 - Focus)
        document.title = `${minutes}:${seconds} - ${modeLabel}`;

        // Cleanup: Quando o usuário sair dessa página/componente, volta ao título original
        return () => {
            document.title = "Matt's Habit Tracker";
        };
    }, [time, mode]);

    const playAlarm = () => {
        setIsAlarmPlaying(true);
        alarmRef.current.currentTime = 0;

        alarmRef.current.play().catch(e => console.error("Erro ao tocar:", e));

        if (autoSkip) {
            autoSkipTimeoutRef.current = setTimeout(() => {
                handleSkip();
            }, 3000);
        }
    };

    const stopAlarm = () => {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
        setIsAlarmPlaying(false);

        // Limpa o timeout do autoskip se o usuário clicar antes
        if (autoSkipTimeoutRef.current) {
            clearTimeout(autoSkipTimeoutRef.current);
            autoSkipTimeoutRef.current = null;
        }
    };

    const toggleTimer = () => {
        stopAlarm();
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        stopAlarm();
        setIsRunning(false);

        if (mode === "focus") setTime(focusTime * 60);
        else if (mode === "rest") setTime(restTime * 60);
        else setTime(longRestTime * 60);
    };

    const handleSkip = () => {
        stopAlarm();
        setIsRunning(false);

        let nextMode = mode;

        if (mode === "focus") {
            const newCycle = currentCycle + 1;
            setCurrentCycle(newCycle);

            if (newCycle < cycles) {
                nextMode = "rest";
            } else {
                nextMode = "longRest";
                setCurrentCycle(0);
            }

        } else {
            nextMode = "focus";
        }

        setMode(nextMode);
        // O useEffect das configs vai cuidar de atualizar o setTime baseado no nextMode
    };

    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    return (
        <>
            <div className="min-h-[350px] bg-white dark:bg-[#353b5c] dark:border-gray-600 rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 border-2 border-indigo-600 ">

                <div className="flex flex-col items-center gap-2">
                    <h2 className={`text-xl font-bold uppercase tracking-widest ${mode === "focus" ? "text-indigo-600 dark:text-gray-100" : "text-green-600"}`}>
                        {mode === "focus" ? "Focus Time" : "Rest Time"}
                    </h2>

                    <label className="text-indigo-800 dark:text-gray-100 font-medium">
                        <input
                            type="checkbox"
                            checked={autoSkip}
                            onChange={(e) => setAutoSkip(e.target.checked)}
                        /> Auto Skip Alarms
                    </label>

                    <div className="p-8 text-7xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                        {minutes}:{seconds}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full justify-center">
                    <button
                        onClick={toggleTimer}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-md w-28 hover:scale-105
                        ${isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    >
                        {isRunning ? "Pause" : "Start"}
                    </button>

                    <button
                        onClick={handleSkip}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors
                        ${isAlarmPlaying ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
                                : "text-indigo-700 bg-indigo-50 border-2 border-indigo-100 hover:bg-indigo-100"}`}
                    >
                        Skip
                    </button>

                    <button
                        onClick={handleReset}
                        className="px-4 py-3 rounded-lg font-semibold text-gray-500 bg-gray-50 border-2 border-gray-200 hover:bg-gray-100"
                    >
                        Reset
                    </button>
                </div>

                <div className="w-full border-t border-gray-100"></div>

            </div>

            {(
                <PomodoroOptionsCard
                    autoSkip={autoSkip}
                    setAutoSkip={setAutoSkip}
                    focusTime={focusTime}
                    setFocusTime={setFocusTime}
                    restTime={restTime}
                    setRestTime={setRestTime}
                    longRestTime={longRestTime}
                    setLongRestTime={setLongRestTime}
                    cycles={cycles}
                    setCycles={setCycles}
                    alarmVolume={alarmVolume}
                    setAlarmVolume={setAlarmVolume}
                />
            )}
        </>
    );
}

function getSavedSettings(key, defaultValue) {
    const saved = localStorage.getItem("configs_pomodoro");
    if (!saved) return defaultValue;

    try {
        const parsed = JSON.parse(saved);
        return parsed[key] !== undefined ? parsed[key] : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}


