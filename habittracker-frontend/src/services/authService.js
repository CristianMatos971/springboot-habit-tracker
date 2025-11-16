import apiFetch from "./api";

export async function register(data) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function login(data) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
}
