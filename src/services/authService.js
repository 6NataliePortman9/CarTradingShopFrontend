import { API_BASE } from "../config/api";

const BASE_URL = `${API_BASE}/api`;

export async function login(email, password) {
    const response = await fetch(
        `${BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmail: email,
                userPassword: password,
            }),
        }

    );

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return await response.json();
}

export async function register(userData) {
    const response = await fetch(
        `${BASE_URL}/users`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
    }

    return await response.json();
}

export async function forgotPassword(email) {

    const response = await fetch(
        `${BASE_URL}/auth/forgot-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: email
            })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to send reset email");
    }

    return await response.json();
}

export async function resetPassword(token, newPassword) {

    const response = await fetch(
        `${BASE_URL}/auth/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                newPassword
            })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to reset password");
    }

    return await response.json();
}