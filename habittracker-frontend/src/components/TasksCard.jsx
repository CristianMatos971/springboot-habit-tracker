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
        <div className="min-h-[500px] bg-white rounded-xl shadow-md p-6 border-2 border-indigo-600 flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Tasks</h2>

                {isFormOpen && (
                    <button
                        onClick={resetForm}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ex: Study Spring Security"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                            placeholder="Add details..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="datetime-local"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        {editingId ? "Update Task" : "Create Task"}
                    </button>
                </form>
            ) : (

                <>
                    <button
                        onClick={handleNewClick}
                        className="mb-4 w-full py-2 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>+</span> Add New Task
                    </button>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
                        {tasks.length === 0 && (
                            <p className="text-center text-gray-400 mt-10">No tasks yet. Time to focus!</p>
                        )}

                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`group flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id, !task.completed)}
                                    className="mt-1.5 w-4 h-4 accent-indigo-600 cursor-pointer"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                                        {task.title}
                                    </p>

                                    {task.description && (
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{task.description}</p>
                                    )}

                                    {task.deadline && (
                                        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded mt-1.5 ${task.completed ? "bg-gray-100 text-gray-400" : "bg-orange-50 text-orange-600"}`}>
                                            🕒 {new Date(task.deadline).toLocaleDateString()} {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(task)}
                                        className="text-xs text-blue-500 hover:text-blue-700 font-medium p-1"
                                        title="Edit"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="text-xs text-red-400 hover:text-red-600 font-medium p-1"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
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