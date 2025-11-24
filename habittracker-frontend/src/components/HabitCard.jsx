import { useState } from "react";
import { useHabits } from "../hooks/useHabits";
import HabitItem from "./HabitItem";

export default function HabitCard() {
    const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        goal: 0.0,
        colorCode: "#4F46E5"
    });

    const resetForm = () => {
        setFormData({ name: "", unit: "", goal: 0.0, colorCode: "#4F46E5" });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleNewClick = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleEditClick = (habit) => {
        setEditingId(habit.id);
        setFormData({
            name: habit.name,
            unit: habit.unit,
            goal: habit.goal,
            colorCode: habit.colorCode || "#4F46E5"
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) return;

        const payload = {
            ...formData,
            goal: parseFloat(formData.goal)
        };

        try {
            if (editingId) {
                await updateHabit(editingId, payload);
            } else {
                await addHabit(payload);
            }
            resetForm();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar hábito.");
        }
    };

    return (
        <div className="max-h-[80vh] min-h-[750px] bg-white rounded-xl shadow-md p-6 border-2 border-indigo-600 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Habits Dashboard</h2>

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
                        <label className="block text-base font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                            placeholder="Ex: Estudar Diariamente"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Unit</label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                                placeholder="Ex: pages, sessions"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Daily Goal</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.goal}
                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                                placeholder="0.0"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">Theme Color</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={formData.colorCode}
                                onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                                className="h-12 w-20 p-1 bg-white border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="text-gray-500 font-mono">{formData.colorCode}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        {editingId ? "Update Habit" : "Create Habit"}
                    </button>
                </form>
            ) : (
                <>
                    <button
                        onClick={handleNewClick}
                        className="mb-6 w-full py-3 bg-blue-50 text-blue-600 font-bold text-base rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>+</span> Create New Habit
                    </button>

                    <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                        {habits.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-400 text-lg">No habits being tracked yet.</p>
                                <p className="text-gray-300 text-sm">Start by clicking the button above.</p>
                            </div>
                        )}

                        {habits.map((habit) => (
                            <HabitItem
                                key={habit.id}
                                habit={habit}
                                onEdit={handleEditClick}
                                onDelete={deleteHabit}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}