import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHabits } from '../hooks/useHabits';

export default function HabitItem({ habit, onEdit, onDelete }) {
    const { logHabit, deleteHabitLog, fetchHabitLogs } = useHabits();

    const [history, setHistory] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayValue, setDayValue] = useState("");
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    const loadLogs = useCallback(async () => {
        try {
            setIsLoadingLogs(true);
            const data = await fetchHabitLogs(habit.id);
            setHistory(data.history || {});
        } catch (error) {
            console.error("Falha ao carregar logs do heatmap", error);
        } finally {
            setIsLoadingLogs(false);
        }
    }, [habit.id, fetchHabitLogs]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);


    const localLogs = Object.entries(history).map(([date, value]) => ({
        date,
        value
    }));

    const yearDays = Array.from({ length: 365 }, (_, i) => {
        const date = new Date(2025, 0, 1);
        date.setDate(date.getDate() + i);
        return date;
    });

    const handleDayClick = (date) => {
        const formattedDate = formatDate(date);

        const existingLog = localLogs.find(l => l.date === formattedDate);

        setSelectedDay(date);
        setDayValue(existingLog ? existingLog.value : "");
    };

    const handleSaveDayLog = async (e) => {
        e.preventDefault();
        if (!selectedDay) return;

        const dateStr = formatDate(selectedDay);

        try {
            await logHabit(habit.id, dayValue || 1, dateStr);
            await loadLogs();
            setSelectedDay(null);
        } catch (error) {
            alert("Erro ao salvar o registro.");
        }
    };

    const handleDeleteLog = async () => {
        if (!selectedDay) return;
        const dateStr = formatDate(selectedDay);

        try {
            await deleteHabitLog(habit.id, dateStr);
            await loadLogs();
            setSelectedDay(null);
        } catch (error) {
            alert("Erro ao remover o registro.");
        }
    };

    const handleCompleteToday = async () => {
        const todayStr = formatDate(new Date());
        try {
            await logHabit(habit.id, habit.goal, todayStr);
            await loadLogs();
        } catch (error) {
            console.error("Erro ao completar hoje", error);
        }
    };

    const isCompletedToday = history[formatDate(new Date())] !== undefined;
    const todayStr = formatDate(new Date());


    const { alignedDays, weeks } = buildAlignedCalendar(2025);
    const gridRef = useRef(null);

    // Scroll automático para o dia atual no heatmap
    useEffect(() => {
        if (!gridRef.current || alignedDays.length === 0) return;

        const idx = alignedDays.findIndex(d => d && formatDate(d) === todayStr);
        if (idx === -1) return;

        const col = Math.floor(idx / 7);

        const columnWidth = 26;
        const scrollPos = col * columnWidth - gridRef.current.clientWidth / 2;

        gridRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
    }, [alignedDays]);

    return (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 shadow-sm border border-gray-200 relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{habit.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                        Goal: {habit.goal} {habit.unit}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(habit)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button
                        onClick={() => onDelete(habit.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deletar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 mb-3 text-sm font-bold text-gray-700">
                <button className="hover:bg-gray-200 p-1 rounded text-gray-400">&lt;</button>
                <span>2025</span>
                <button className="hover:bg-gray-200 p-1 rounded text-gray-400">&gt;</button>
            </div>

            {/* Grid 7x53 (Heatmap) */}
            <div
                ref={gridRef}
                className="grid grid-flow-col grid-rows-7 gap-[3px] mb-6 overflow-x-auto pb-3 pr-4">

                {weeks.flat().map((date, index) => {
                    if (!date) {
                        return (
                            <div
                                key={index}
                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-[4px] bg-transparent"
                            />
                        );
                    }

                    const dateStr = formatDate(date);
                    const hasLog = history[dateStr] !== undefined;
                    const isToday = dateStr === todayStr;

                    return (
                        <div
                            key={index}
                            onClick={() => handleDayClick(date)}
                            title={`${dateStr} ${hasLog ? '- Feito' : ''}`}
                            className={`
                                        w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                                        rounded-[4px] cursor-pointer transition-all
                                        ${hasLog ? '' : 'bg-gray-200'}
                                        ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
                                        hover:ring-2 hover:ring-offset-1 hover:ring-indigo-400
                                    `}
                            style={{
                                backgroundColor: hasLog ? (habit.colorCode || '#4F46E5') : undefined
                            }}
                        />
                    );
                })}
            </div>

            {
                selectedDay && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 animate-in fade-in duration-200">
                        <form onSubmit={handleSaveDayLog} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-80">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-700">
                                    {selectedDay.toLocaleDateString()}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDay(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Qtd ({habit.unit})
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    autoFocus
                                    value={dayValue}
                                    onChange={(e) => setDayValue(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder={`Meta: ${habit.goal}`}
                                />
                            </div>

                            <div className="flex gap-2">
                                {history[formatDate(selectedDay)] !== undefined && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteLog}
                                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 font-medium"
                                        title="Remover registro"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0-1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium"
                                >
                                    Salvar
                                </button>
                            </div>

                        </form>
                    </div>
                )
            }

            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500 font-bold">🔥 Streak: {localLogs.length > 0 ? 'Active' : 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">📊 Total Logs: {localLogs.length}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCompleteToday}
                        className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <div className={`w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center ${isCompletedToday ? 'bg-green-500 border-green-500' : ''}`}>
                            {isCompletedToday && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        {isCompletedToday ? "Completed Today" : "Complete Today"}
                    </button>
                </div>
            </div>
        </div >
    );
}

const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function buildAlignedCalendar(year) {
    const days = [];
    let d = new Date(year, 0, 1);
    while (d.getFullYear() === year) {
        days.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }

    // Alinha início — segunda-feira como linha 0
    const firstWeekday = (days[0].getDay() + 6) % 7;
    const paddedStart = Array(firstWeekday).fill(null);

    const lastWeekday = (days[days.length - 1].getDay() + 6) % 7;
    const offsetEnd = 6 - lastWeekday;
    const paddedEnd = Array(offsetEnd).fill(null);

    const alignedDays = [...paddedStart, ...days, ...paddedEnd];

    const weeks = [];
    for (let i = 0; i < alignedDays.length; i += 7) {
        weeks.push(alignedDays.slice(i, i + 7));
    }

    // Garante matriz 7×53 real
    while (weeks.length < 53) {
        weeks.push(Array(7).fill(null));
    }

    return { alignedDays, weeks };
}