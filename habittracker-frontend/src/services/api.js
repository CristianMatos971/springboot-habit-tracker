const API_BASE_URL = "http://localhost:8080";

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        body: options.body
    };

    const response = await fetch(API_BASE_URL + endpoint, config);

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw err;
    }

    return response.json();
}

export default apiFetch;
