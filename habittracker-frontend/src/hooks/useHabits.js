import { useState, useEffect, useCallback, useRef } from "react";
import * as habitService from "../services/habitService";
import { useAuth } from "../context/AuthContext";

export function useHabits() {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    // Estado para armazenar logs de um hábito específico quando detalhado
    const [selectedHabitLogs, setSelectedHabitLogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [localLogs, setLocalLogs] = useState({});
    const localLogsRef = useRef({});

    useEffect(() => {
        // Verifica user
        if (user) {
            fetchHabits();
        } else {
            setLoading(false);
        }
    }, [user]);

    async function fetchHabits() {
        try {
            setLoading(true);
            const data = await habitService.getHabits();
            setHabits(data);
        } catch (err) {
            setError(err);
            console.error("Erro ao carregar hábitos", err);
        } finally {
            setLoading(false);
        }
    }

    async function addHabit(habitData) {
        if (user) {
            try {
                const newHabit = await habitService.addHabit(habitData);
                setHabits((prev) => [...prev, newHabit]);
                return newHabit;
            } catch (err) {
                console.error(err);
                throw err;
            }
        } else {
            // RAM
            const newHabit = { ...habitData, id: Date.now() };
            setHabits((prev) => [...prev, newHabit]);
            return newHabit;
        }
    }

    async function updateHabit(id, habitData) {
        setHabits((prev) => prev.map(h => h.id === id ? { ...h, ...habitData } : h));

        if (user) {
            try {
                await habitService.updateHabit(id, habitData);
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    }

    async function deleteHabit(id) {
        const previousHabits = [...habits];
        setHabits((prev) => prev.filter(h => h.id !== id));

        // Só persiste se logado
        if (user) {
            try {
                await habitService.deleteHabit(id);
            } catch (err) {
                console.error("Erro ao deletar hábito", err);
                setHabits(previousHabits);
                throw err;
            }
        }
    }

    // --- Funções de Log ---

    // Busca os logs detalhados de um hábito (Retorna HabitDetailsDTO)
    const fetchHabitLogs = useCallback(async (habitId, fromDate = null) => {
        if (user) {
            try {
                const data = await habitService.getHabitLogs(habitId, fromDate);
                setSelectedHabitLogs(data);
                return data;
            } catch (err) {
                console.error(`Erro ao buscar logs`, err);
                throw err;
            }
        } else {
            // Lógica RAM para gerar estatísticas e evitar crash do Frontend
            const logs = localLogsRef.current[habitId] || {};

            const values = Object.values(logs);
            const totalCount = values.length;
            const sum = values.reduce((a, b) => a + parseFloat(b), 0);

            const mockData = {
                history: logs,
                currentStreak: totalCount > 0 ? 1 : 0,
                maxStreak: totalCount,
                AveragePerDay: totalCount > 0 ? (sum / totalCount).toFixed(1) : 0,
                unit: habits.find(h => h.id === habitId)?.unit || ''
            };

            setSelectedHabitLogs(mockData);
            return mockData;
        }
    }, [user, habits]);

    async function logHabit(habitId, value, date) {
        if (user) {
            try {
                const response = await habitService.logHabit(habitId, value, date);
                return response;
            } catch (err) {
                console.error("Erro ao registrar log", err);
                throw err;
            }
        } else {
            // RAM: Atualiza o objeto localLogs
            const currentHabitLogs = localLogsRef.current[habitId] || {};
            const updatedHabitLogs = { ...currentHabitLogs, [date]: parseFloat(value) };

            localLogsRef.current = {
                ...localLogsRef.current,
                [habitId]: updatedHabitLogs
            };

            // Atualizamos o State para consistência 
            setLocalLogs(localLogsRef.current);

            return { success: true };
        }
    }

    async function deleteHabitLog(habitId, date) {
        if (user) {
            try {
                await habitService.deleteHabitLog(habitId, date);
            } catch (err) {
                console.error("Erro ao remover log", err);
                throw err;
            }
        } else {
            const currentHabitLogs = { ...(localLogsRef.current[habitId] || {}) };
            delete currentHabitLogs[date];

            localLogsRef.current = {
                ...localLogsRef.current,
                [habitId]: currentHabitLogs
            };

            // Atualizamos o State
            setLocalLogs(localLogsRef.current);
        }
    }

    return {
        habits,
        selectedHabitLogs,
        loading,
        error,
        fetchHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        fetchHabitLogs,
        logHabit,
        deleteHabitLog
    };
}