function TasksCard() {
    const dummyTasks = [
        { id: 1, title: "Study React", deadline: "Today", done: false },
        { id: 2, title: "Finish API", deadline: "2 days", done: false },
        { id: 3, title: "Buy Food", deadline: "1 Week", done: true },
    ];

    return (
        <div className="min-h-[700px] bg-white rounded-xl shadow-md p-6 border-2 border-indigo-600">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Tarefas</h2>

            <button className="mb-4 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg">
                New Task
            </button>

            <ul className="space-y-3">
                {dummyTasks.map((task) => (
                    <li
                        key={task.id}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <div>
                            <p className={task.done ? "line-through text-gray-500" : ""}>
                                {task.title}
                            </p>
                            <span className="text-xs text-gray-500">{task.deadline}</span>
                        </div>
                        <input type="checkbox" checked={task.done} readOnly />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TasksCard;
