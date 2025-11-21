import { useState, useEffect } from "react";
import * as taskService from "../services/taskService"; 1

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Carregar tarefas ao montar o componente
    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (err) {
            setError(err);
            console.error("Erro ao carregar tarefas", err);
        } finally {
            setLoading(false);
        }
    }

    async function addTask(taskData) {
        try {
            const newTask = await taskService.addTask(taskData);
            setTasks((prev) => [...prev, newTask]);
            return newTask;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function updateTask(id, taskData) {
        try {
            const updatedTask = await taskService.updateTask(id, taskData);
            setTasks((prev) => prev.map(t => t.id === id ? updatedTask : t));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async function toggleTask(id, isCompleted) {
        setTasks((prev) => prev.map(t =>
            t.id === id ? { ...t, completed: isCompleted } : t
        ));

        try {
            await taskService.toggleTask(id, isCompleted);
        } catch (err) {
            console.error("Erro ao atualizar status", err);
            fetchTasks();
        }
    }

    async function deleteTask(id) {
        const previousTasks = [...tasks];
        setTasks((prev) => prev.filter(t => t.id !== id));

        try {
            await taskService.deleteTask(id);
        } catch (err) {
            console.error("Erro ao deletar", err);
            setTasks(previousTasks);
        }
    }

    // Exporta tudo para o componente usar
    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        toggleTask,
        deleteTask
    };
}