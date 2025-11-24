import apiFetch from "./api";

export async function getHabits() {
    return apiFetch("api/habits", {
        method: "GET"
    });
}

export async function addHabit(habitData) {
    return apiFetch("api/habits", {
        method: "POST",
        body: JSON.stringify(habitData)
    });
}

export async function updateHabit(habitId, habitData) {
    return apiFetch(`api/habits/${habitId}`, {
        method: "PUT",
        body: JSON.stringify({
            name: habitData.name,
            unit: habitData.unit,
            goal: habitData.goal,
            colorCode: habitData.colorCode,
            done: habitData.done
        })
    });
}

export async function deleteHabit(habitId) {
    return apiFetch(`api/habits/${habitId}`, {
        method: "DELETE"
    });
}

export async function getHabitLogs(habitId, fromDate = null) {
    let url = `api/habits/${habitId}/logs`;
    if (fromDate) {
        url += `?fromDate=${encodeURIComponent(fromDate)}`;
    }

    return apiFetch(url, {
        method: "GET"
    });
}


export async function logHabit(habitId, value, date) {
    return apiFetch(`api/habits/${habitId}/logs`, {
        method: "POST",
        body: JSON.stringify({
            value: parseFloat(value),
            date: date
        })
    });
}

export async function deleteHabitLog(habitId, date) {
    return apiFetch(`api/habits/${habitId}/logs?date=${encodeURIComponent(date)}`, {
        method: "DELETE"
    });
}