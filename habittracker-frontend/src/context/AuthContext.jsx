import { useContext, createContext, useState, useEffect } from "react";
import { login as loginService } from "../services/authService";
import { register as registerService } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        if (!token) return;
        // opcional: carregar dados do usuário se tiver endpoint /me
    }, [token]);

    async function register(credentials) {
        const res = await registerService(credentials);

        setToken(res.token);
        localStorage.setItem("token", res.token);

        setUser(res.user);
        try {
            localStorage.setItem("user", JSON.stringify(res.user));
        } catch (e) {
            // ignore localStorage failures
        }

        return res;
    }

    async function login(credentials) {
        const res = await loginService(credentials);

        setToken(res.token);
        localStorage.setItem("token", res.token);

        setUser(res.user);
        try {
            localStorage.setItem("user", JSON.stringify(res.user));
        } catch (e) {
            // ignore localStorage failures
        }

        return res;
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    const value = {
        user,
        token,
        isAuthenticated: Boolean(token),
        register,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
