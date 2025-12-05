import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHabits } from '../hooks/useHabits';

export default function HabitItem({ habit, onEdit, onDelete }) {
    const { logHabit, deleteHabitLog, fetchHabitLogs } = useHabits();

    const [history, setHistory] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayValue, setDayValue] = useState("");
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [data, setData] = useState({});

    // Carrega logs do backend
    const loadLogs = useCallback(async () => {
        try {
            setIsLoadingLogs(true);
            const incomingData = await fetchHabitLogs(habit.id);
            setData(incomingData);           // salva métricas + info
            setHistory(incomingData.history || {}); // salva mapa data -> valor
        } catch (error) {
            console.error("Falha ao carregar logs do heatmap", error);
        } finally {
            setIsLoadingLogs(false);
        }
    }, [habit.id, fetchHabitLogs]);

    // Executado ao montar o componente ou quando o hábito muda
    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    // Lista local com pares {date, value}
    const localLogs = Object.entries(history).map(([date, value]) => ({
        date,
        value
    }));

    // Gera todos os 365 dias do ano
    const yearDays = Array.from({ length: 365 }, (_, i) => {
        const date = new Date(2025, 0, 1);
        date.setDate(date.getDate() + i);
        return date;
    });

    // Ao clicar no quadrado do heatmap
    const handleDayClick = (date) => {
        const formattedDate = formatDate(date);

        const existingLog = localLogs.find(l => l.date === formattedDate);

        setSelectedDay(date);           // abre modal
        setDayValue(existingLog ? existingLog.value : ""); // preenche se houver log
    };

    // Salvar/editar o log de um dia
    const handleSaveDayLog = async (e) => {
        e.preventDefault();
        if (!selectedDay) return;

        const dateStr = formatDate(selectedDay);

        try {
            await logHabit(habit.id, dayValue || 1, dateStr);
            await loadLogs();           // Recarrega após salvar
            setSelectedDay(null);       // fecha modal
        } catch (error) {
            alert("Erro ao salvar o registro.");
        }
    };

    // Remover log do dia
    const handleDeleteLog = async () => {
        if (!selectedDay) return;
        const dateStr = formatDate(selectedDay);

        try {
            await deleteHabitLog(habit.id, dateStr);
            await loadLogs();           // Recarrega estado
            setSelectedDay(null);
        } catch (error) {
            alert("Erro ao remover o registro.");
        }
    };

    // Botão "Complete Today"
    const handleCompleteToday = async () => {
        const todayStr = formatDate(new Date());
        try {
            await logHabit(habit.id, habit.goal, todayStr);
            await loadLogs();
        } catch (error) {
            console.error("Erro ao completar hoje", error);
        }
    };

    // Marca se o dia atual já tem log
    const isCompletedToday = history[formatDate(new Date())] !== undefined;
    const todayStr = formatDate(new Date());

    // Gera matriz 7x53 alinhada
    const { alignedDays, weeks } = buildAlignedCalendar(2025);
    const gridRef = useRef(null);

    // Scroll automático para o dia atual
    useEffect(() => {
        if (!gridRef.current || alignedDays.length === 0) return;

        const idx = alignedDays.findIndex(d => d && formatDate(d) === todayStr);
        if (idx === -1) return;

        const col = Math.floor(idx / 7);
        const columnWidth = 26;

        const scrollPos = col * columnWidth - gridRef.current.clientWidth / 2;

        gridRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
    }, [alignedDays]);

    // ---- Cores dinâmicas do Heatmap ----
    const valuesArray = Object.values(history);
    const maxValue = valuesArray.length > 0 ? Math.max(...valuesArray) : 0;
    // --- vão ser usadas no mapeamento de cores do heatmap ---

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700 relative transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
                <div>
                    {/* Título e Subtítulo */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{habit.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Goal: {habit.goal} {habit.unit}
                    </p>
                </div>

                <div className="flex gap-2">
                    {/* Botão Editar */}
                    <button
                        onClick={() => onEdit(habit)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    {/* Botão Deletar */}
                    <button
                        onClick={() => onDelete(habit.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Deletar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>

            {/* Navegação do Ano */}
            <div className="flex justify-center items-center gap-4 mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-gray-400 dark:text-gray-500 dark:hover:text-gray-300">&lt;</button>
                <span>2025</span>
                <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-gray-400 dark:text-gray-500 dark:hover:text-gray-300">&gt;</button>
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
                                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-[4px] bg-transparent"
                            />
                        );
                    }

                    const dateStr = formatDate(date);
                    const value = history[dateStr];
                    const hasLog = value != null && value > 0;
                    const isToday = dateStr === todayStr;

                    // intensidade entre 0 e 1
                    const intensity = hasLog && maxValue > 0
                        ? Math.min(value / data.AveragePerDay, 1)
                        : 0;

                    const backgroundColor = hasLog
                        ? shadeColor(habit.colorCode || "#4F46E5", intensity)
                        : "#e5e7eb"; // bg-gray-200

                    return (
                        <div
                            key={index}
                            onClick={() => handleDayClick(date)}
                            title={`${dateStr} ${hasLog ? '- Done: ' + value + ' ' + data.unit : ''}`}
                            className={`
                                    w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5
                                    rounded-[4px] cursor-pointer transition-all
                                    ${isToday ? 'ring-4 ring-green-500 ring-offset-1 dark:ring-offset-gray-800' : ''}
                                    hover:ring-2 hover:ring-offset-1 dark:hover:ring-offset-gray-800 hover:ring-indigo-400
                                `}
                            style={{
                                backgroundColor: backgroundColor
                            }}
                        />
                    );
                })}
            </div>

            {
                selectedDay && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 animate-in fade-in duration-200">
                        <form onSubmit={handleSaveDayLog} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-gray-700 dark:text-gray-200">
                                    {selectedDay.toLocaleDateString()}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDay(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <div className="mb-2">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                    Qtd ({habit.unit})
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    autoFocus
                                    value={dayValue}
                                    onChange={(e) => setDayValue(e.target.value)}
                                    // INPUT: Ajustado para fundo branco e texto preto (como nos outros forms) ou dark mode completo
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                                    placeholder={`Meta: ${habit.goal}`}
                                />
                            </div>

                            <div className="flex gap-2">
                                {history[formatDate(selectedDay)] !== undefined && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteLog}
                                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 font-medium transition-colors"
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
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 font-medium transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>

                        </form>
                    </div>
                )
            }

            <div className="flex flex-col md:flex-row justify-between items-end gap-4">

                {/* Métricas do hábito */}
                <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">

                    {/* Streak atual */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <span className="font-bold text-orange-600 dark:text-orange-500">
                            Current Streak: {data.currentStreak}
                        </span>
                    </div>

                    {/* Máximo streak */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏆</span>
                        <span className="font-medium">
                            Max Streak: {data.maxStreak}
                        </span>
                    </div>

                    {/* Média */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            Average (of filled days): {data.AveragePerDay} {data.unit}
                        </span>
                    </div>

                    {/* Total de logs */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🗂️</span>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                            Total Logs: {Object.keys(history).length}
                        </span>
                    </div>

                </div>

                {/* Botão de completar hoje */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCompleteToday}
                        className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-95"
                    >
                        <div className={`w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center ${isCompletedToday ? 'bg-green-500 border-green-500 dark:border-green-500' : ''}`}>
                            {isCompletedToday && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>

                        {isCompletedToday ? "Completed Today" : "Complete Today"}
                    </button>
                </div>

            </div>

        </div >
    );
}

// Ajusta cor com base na intensidade (0-1)
function shadeColor(hex, factor) {

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const newR = Math.round(r + (255 - r) * (1 - factor));
    const newG = Math.round(g + (255 - g) * (1 - factor));
    const newB = Math.round(b + (255 - b) * (1 - factor));

    return `rgb(${newR}, ${newG}, ${newB})`;
}

// Converte Date para "YYYY-MM-DD"
const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Cria matriz 53 colunas × 7 linhas alinhada por semanas
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