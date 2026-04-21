import { useState } from "react";
import { LoginService, logoutService } from "../services/LoginService";

export function useAuth() {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("jvToken")
    );

    async function login(username: string, password: string) {
        const data = await LoginService(username, password);
        setToken(data.token);
        localStorage.setItem("jvToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.users));
    }

    async function logout() {
        await logoutService();
        setToken(null);
        localStorage.removeItem("jvToken");
        localStorage.removeItem("user");
    }

    return { token, login, logout, isAuthenticated: !!token };
}

