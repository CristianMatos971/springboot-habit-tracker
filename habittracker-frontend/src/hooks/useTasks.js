import { useState, useEffect } from "react";
import * as taskService from "../services/taskService"; 1
import { useAuth } from "../context/AuthContext"; // Importa o hook de autenticação

export function useTasks() {
    const { user } = useAuth(); // Adicionado: Verificação de usuário
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchTasks();
        } else {
            setLoading(false);
        }
    }, [user]);

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
        // Lógica bifurcada (Backend vs RAM)
        if (user) {
            try {
                const newTask = await taskService.addTask(taskData);
                setTasks((prev) => [...prev, newTask]);
                return newTask;
            } catch (err) {
                console.error(err);
                throw err;
            }
        } else {
            const newTask = {
                ...taskData,
                id: Date.now(),
                completed: false
            };
            setTasks((prev) => [...prev, newTask]);
            return newTask;
        }
    }

    async function updateTask(id, taskData) {
        // O estado visual atualiza primeiro em ambos os casos
        setTasks((prev) => prev.map(t => t.id === id ? { ...t, ...taskData } : t));

        if (user) {
            try {
                await taskService.updateTask(id, taskData);
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    }

    async function toggleTask(id, isCompleted) {
        setTasks((prev) => prev.map(t =>
            t.id === id ? { ...t, completed: isCompleted } : t
        ));

        // Só chama serviço se logado
        if (user) {
            try {
                await taskService.toggleTask(id, isCompleted);
            } catch (err) {
                console.error("Erro ao atualizar status", err);
                fetchTasks(); // Reverte se der erro
            }
        }
    }

    async function deleteTask(id) {
        const previousTasks = [...tasks];
        setTasks((prev) => prev.filter(t => t.id !== id));

        // Só chama serviço se logado
        if (user) {
            try {
                await taskService.deleteTask(id);
            } catch (err) {
                console.error("Erro ao deletar", err);
                setTasks(previousTasks);
            }
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