import apiFetch from "./api";

export async function getTasks() {
    return apiFetch("api/tasks", {
        method: "GET"
    });
}

export async function addTask(taskData) {
    return apiFetch("api/tasks", {
        method: "POST",
        body: JSON.stringify(taskData)
    });
}

export async function toggleTask(taskId, isCompleted) {
    return apiFetch(`api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: isCompleted })
    });
}

export async function updateTask(taskId, taskData) {
    return apiFetch(`api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            deadline: taskData.deadline,
            completed: taskData.completed
        })
    });
}

export async function deleteTask(taskId) {
    return apiFetch(`api/tasks/${taskId}`, {
        method: "DELETE"
    });
}