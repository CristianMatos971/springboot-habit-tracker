function HabitCard() {
    const dummyHabits = [
        { id: 1, name: "Ler 20 minutos", done: false },
        { id: 2, name: "Meditar", done: true },
        { id: 3, name: "Academia", done: false },
    ];

    return (
        <div className="min-h-[700px] bg-white rounded-xl shadow-md p-6 border-2 border-indigo-600">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Hábitos</h2>

            <button className="mb-4 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg">
                Novo Hábito
            </button>

            <ul className="space-y-3">
                {dummyHabits.map((habit) => (
                    <li
                        key={habit.id}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <span className={habit.done ? "line-through text-gray-500" : ""}>
                            {habit.name}
                        </span>
                        <input type="checkbox" checked={habit.done} readOnly />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HabitCard;
