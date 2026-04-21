import { apiFetch } from "../../../core/api/api";


export async function LoginService(user: string, password: string) {
    return apiFetch("/login/", {
        method: "POST",
        body: JSON.stringify({ user, password }),
    });

}
export async function logoutService() {
    return apiFetch("/auth/logout", { method: "POST" });
}