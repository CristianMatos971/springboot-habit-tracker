import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

export default function TasksCard() {
    const { tasks, addTask, toggleTask, updateTask, deleteTask } = useTasks();

    // Estado para controlar se estamos vendo a lista ou o formulário
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deadline: ""
    });

    const resetForm = () => {
        setFormData({ title: "", description: "", deadline: "" });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleNewClick = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleEditClick = (task) => {
        setEditingId(task.id);

        // Precisamos formatar a data para o input 'datetime-local' (YYYY-MM-DDThh:mm)
        // Supondo que task.deadline venha do banco como ISO string
        let formattedDeadline = "";
        if (task.deadline) {
            const date = new Date(task.deadline);
            formattedDeadline = date.toISOString().slice(0, 16);
        }

        setFormData({
            title: task.title,
            description: task.description || "",
            deadline: formatToLocalInput(task.deadline)
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) return;

        const payload = {
            ...formData,
            deadline: formData.deadline ? formatToUTC(formData.deadline) : null
        };

        try {
            if (editingId) {
                await updateTask(editingId, payload);
            } else {
                await addTask(payload);
            }
            resetForm();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar tarefa.");
        }
    };

    return (
        <div className="max-h-[80vh] min-h-[750px] bg-white rounded-xl shadow-md p-6 border-2 border-indigo-600 flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>

                {isFormOpen && (
                    <button
                        onClick={resetForm}
                        className="text-base text-gray-500 hover:text-gray-700 underline"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                            placeholder="Ex: Study Spring Security"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-28 resize-none text-base"
                            placeholder="Add details..."
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="datetime-local"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600 text-base"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        {editingId ? "Update Task" : "Create Task"}
                    </button>
                </form>
            ) : (

                <>
                    <button
                        onClick={handleNewClick}
                        className="mb-6 w-full py-3 bg-blue-50 text-blue-600 font-bold text-base rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>+</span> Add New Task
                    </button>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                        {tasks.length === 0 && (
                            <p className="text-center text-gray-400 mt-10 text-lg">No tasks yet. Time to focus!</p>
                        )}

                        {tasks.map((task) => {
                            const deadlineStatus = getDeadlineStatus(task.deadline, task.completed);

                            return (
                                <div
                                    key={task.id}
                                    className={`group flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id, !task.completed)}
                                        className="mt-2 w-5 h-5 accent-indigo-600 cursor-pointer"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-lg truncate ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                                            {task.title}
                                        </p>

                                        {task.description && (
                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed break-words">
                                                {task.description}
                                            </p>
                                        )}

                                        {task.deadline && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border ${deadlineStatus.classes}`}>
                                                    {deadlineStatus.icon + " "}
                                                    {new Date(task.deadline).toLocaleDateString()} — {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>

                                                {deadlineStatus.label && !task.completed && (
                                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide animate-pulse">
                                                        {deadlineStatus.label}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(task)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}


// Lógica para determinar a cor e o ícone do prazo
function getDeadlineStatus(isoDeadline, isCompleted) {
    if (!isoDeadline) return { classes: "", icon: "", label: null };

    if (isCompleted) {
        return {
            classes: "bg-gray-100 text-gray-400 border-transparent",
            icon: "✓",
            label: null
        };
    }

    const deadlineDate = new Date(isoDeadline);
    const now = new Date();
    const diffInHours = (deadlineDate - now) / (1000 * 60 * 60);


    if (diffInHours < 0) {
        return {
            classes: "bg-red-50 text-red-700 border-red-100",
            icon: "⚠️",
            label: "Late"
        };
    }

    if (diffInHours < 24) {
        return {
            classes: "bg-orange-50 text-orange-700 border-orange-100",
            icon: "🔥",
            label: "Urgent"
        };
    }

    return {
        classes: "bg-blue-50 text-blue-700 border-blue-100",
        icon: "📅",
        label: null
    };
}

// 1. Converte ISO do Banco (UTC) para formato do Input (Local)
// Entrada: "2025-11-21T17:00:00Z" -> Saída: "2025-11-21T14:00"
export function formatToLocalInput(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);

    // O input datetime-local espera o formato "YYYY-MM-DDThh:mm"
    // Precisamos "mentir" para o objeto Date para pegar os números locais formatados como ISO
    // Subtraímos o offset (em minutos) * 60000 (ms)
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

    // Pegamos os primeiros 16 caracteres (removemos segundos e o Z)
    return localDate.toISOString().slice(0, 16);
}

// 2. Converte formato do Input (Local) para ISO do Banco (UTC)
// Entrada: "2025-11-21T14:00" -> Saída: "2025-11-21T17:00:00.000Z"
export function formatToUTC(localString) {
    if (!localString) return null;

    // Cria a data assumindo que o string é horário local do navegador
    const date = new Date(localString);

    // toISOString() automaticamente converte para UTC (adiciona +3h se estiver no BR)
    return date.toISOString();
}