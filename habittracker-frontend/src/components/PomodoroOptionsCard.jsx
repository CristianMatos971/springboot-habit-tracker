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
        <div className="min-h-[360px] bg-white rounded-xl shadow-md p-6 border-4 border-indigo-400 mt-4 w-full">
            <h3 className="text-lg font-bold mb-4">Pomodoro Options</h3>

            <label className="block mb-3 text-gray-700 font-medium">
                Focus Time (min):
                <input
                    min="0"
                    type="number"
                    value={focusTime}
                    onChange={(e) => setFocusTime(Number(e.target.value))}
                    className="ml-2 p-1 border rounded"
                />
            </label>

            <label className="block mb-3 text-gray-700 font-medium">
                Short Break (min):
                <input
                    min="0"
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(Number(e.target.value))}
                    className="ml-2 p-1 border rounded"
                />
            </label>

            <label className="block mb-3 text-gray-700 font-medium">
                Long Break (min):
                <input
                    min="0"
                    type="number"
                    value={longRestTime}
                    onChange={(e) => setLongRestTime(Number(e.target.value))}
                    className="ml-2 p-1 border rounded"
                />
            </label>

            <label className="block mb-3 text-gray-700 font-medium">
                Cycles until long break:
                <input
                    min="0"
                    type="number"
                    value={cycles}
                    onChange={(e) => setCycles(Number(e.target.value))}
                    className="ml-2 p-1 border rounded"
                />
            </label>

            <label className="block text-gray-700 font-medium">
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
