import type { NavigateFunction } from "react-router-dom";

export interface User {
    role: string
    userId: string
}

export let loggedUser: User | null = null

// Funkcije za autentikaciju korisnika -> proverava JWT
export const isAuthenticated = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return false;

    try {
        const parts = jwt.split(".");
        if (parts.length !== 3) return false; // JWT mora imati tri dela

        const payload = JSON.parse(atob(parts[1])); // Dekodiramo payload
        loggedUser = { role: payload.role, userId: payload.userId }

        return true;
    } catch (error) {
        console.error("Greška pri dekodiranju JWT tokena:", error);
        return false; // Ako dođe do greške, vraća false
    }
};

export const isAuthorized = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return false;

    try {
        const parts = jwt.split(".");
        if (parts.length !== 3) return false; // JWT mora imati tri dela

        const payload = JSON.parse(atob(parts[1])); // Dekodiramo payload
        if(payload.role !== 'admin') return false;
        
        return true;
    } catch (error) {
        console.error("Greška pri dekodiranju JWT tokena:", error);
        return false; // Ako dođe do greške, vraća false
    }
};

// Funkcija za odjavu korisnika
export const logout = (navigate: NavigateFunction) => {
    localStorage.removeItem("jwt");
    navigate("/login");
};