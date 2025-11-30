export default function PomodoroOptionsCard({
    focusTime,
    setFocusTime,
    restTime,
    setRestTime,
    longRestTime,
    setLongRestTime,
    cycles,
    setCycles,
    alarmVolume,
    setAlarmVolume
}) {
    return (
        <div className="h-[360px] bg-white dark:bg-[#353b5c] dark:border-gray-600 rounded-xl shadow-md p-6 border-4 border-indigo-400 mt-4 w-full">
            <h3 className="text-lg font-bold mb-2">Pomodoro Options</h3>

            <label className="block mb-1 text-gray-700 dark:text-gray-100 font-medium">
                Focus Time (min):
                <input
                    min="0"
                    type="number"
                    value={focusTime}
                    onChange={(e) => setFocusTime(Number(e.target.value))}
                    className="ml-2 p-1 border rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </label>

            <label className="block mb-2 text-gray-700 dark:text-gray-100 font-medium">
                Short Break (min):
                <input
                    min="0"
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(Number(e.target.value))}
                    className="ml-2 p-1 border rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </label>

            <label className="block mb-2 text-gray-700 dark:text-gray-100 font-medium">
                Long Break (min):
                <input
                    min="0"
                    type="number"
                    value={longRestTime}
                    onChange={(e) => setLongRestTime(Number(e.target.value))}
                    className="ml-2 p-1 border rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </label>

            <label className="block mb-1 text-gray-700 dark:text-gray-100 font-medium">
                Cycles until long break:
                <input
                    min="0"
                    type="number"
                    value={cycles}
                    onChange={(e) => setCycles(Number(e.target.value))}
                    className="ml-2 p-1 border rounded text-gray-900 bg-white border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </label>

            <label className="block text-gray-700 dark:text-gray-100 font-medium">
                Alarm Volume:
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={alarmVolume}
                    onChange={(e) => setAlarmVolume(Number(e.target.value))}
                    className="ml-2"
                />
            </label>
        </div>
    );
}
