import { useContext, createContext, useState, useEffect } from "react";
import { login as loginService } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (!token) return;
        // opcional: carregar dados do usuário se tiver endpoint /me
    }, [token]);

    async function login(credentials) {
        const res = await loginService(credentials);

        setToken(res.token);
        localStorage.setItem("token", res.token);

        setUser(res.user);

        return res;
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    }

    const value = {
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}   
