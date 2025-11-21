const API_BASE_URL = "http://localhost:8080/";

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

    const response = await fetch(API_BASE_URL + cleanEndpoint, config);

    if (!response.ok) {
        // Tenta ler o erro, mas se falhar retorna objeto vazio
        const err = await response.json().catch(() => ({}));
        throw err;
    }

    // 3. CORREÇÃO CRÍTICA PARA DELETE/PUT 204 (NO CONTENT)
    // Se a resposta não tiver conteúdo (status 204), não tente fazer parse do JSON
    if (response.status === 204) {
        return null;
    }

    // Verifica se tem texto antes de converter
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export default apiFetch;
