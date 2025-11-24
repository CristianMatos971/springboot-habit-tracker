import { useState, useEffect, useCallback } from "react";
import * as habitService from "../services/habitService";

export function useHabits() {
    const [habits, setHabits] = useState([]);
    // Estado para armazenar logs de um hábito específico quando detalhado
    const [selectedHabitLogs, setSelectedHabitLogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHabits();
    }, []);

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
        try {
            const newHabit = await habitService.addHabit(habitData);
            setHabits((prev) => [...prev, newHabit]);
            return newHabit;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function updateHabit(id, habitData) {
        try {
            const updatedHabit = await habitService.updateHabit(id, habitData);
            setHabits((prev) => prev.map(h => h.id === id ? updatedHabit : h));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function deleteHabit(id) {
        const previousHabits = [...habits];
        setHabits((prev) => prev.filter(h => h.id !== id));

        try {
            await habitService.deleteHabit(id);
        } catch (err) {
            console.error("Erro ao deletar hábito", err);
            setHabits(previousHabits); // Reverte em caso de erro (Optimistic UI)
            throw err;
        }
    }

    // --- Funções de Log ---

    // Busca os logs detalhados de um hábito (Retorna HabitDetailsDTO)
    const fetchHabitLogs = useCallback(async (habitId, fromDate = null) => {
        try {
            const data = await habitService.getHabitLogs(habitId, fromDate);
            setSelectedHabitLogs(data);
            return data;
        } catch (err) {
            console.error(`Erro ao buscar logs do hábito ${habitId}`, err);
            throw err;
        }
    }, []);

    async function logHabit(habitId, value, date) {
        try {
            const response = await habitService.logHabit(habitId, value, date);
            return response;
        } catch (err) {
            console.error("Erro ao registrar log", err);
            throw err;
        }
    }

    async function deleteHabitLog(habitId, date) {
        try {
            await habitService.deleteHabitLog(habitId, date);
        } catch (err) {
            console.error("Erro ao remover log", err);
            throw err;
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