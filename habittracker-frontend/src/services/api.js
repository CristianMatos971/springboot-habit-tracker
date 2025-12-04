const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/";

function timeoutPromise(ms) {
    return new Promise((_, reject) =>
        setTimeout(() => reject({ timeout: true }), ms)
    );
}

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

    // Remove a barra inicial do endpoint se ela vier por engano, para não duplicar
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

    //Verificação adicional para lidar com o server inicialmente dormindo de maneira amigável
    const TIMEOUT_MS = 8000;

    try {
        // executa fetch e timeout em paralelo
        const response = await Promise.race([
            fetch(API_BASE_URL + cleanEndpoint, config),
            timeoutPromise(TIMEOUT_MS)
        ]);

        if (response.timeout) {
            window.dispatchEvent(new CustomEvent("server-timeout"));
            throw { message: "Server is waking up..." };
        }

        if (response.status === 401) {
            localStorage.removeItem("token");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            throw { message: "Unauthorized" };
        }

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw err;
        }

        if (response.status === 204) return null;

        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (err) {
        // pass error forward
        throw err;
    }
}

export default apiFetch;
