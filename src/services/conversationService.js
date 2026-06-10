import { API_BASE } from "../config/api";

const BASE_URL =`${API_BASE}/api/Conversation`;

export async function getUserConversations(
    userId
) {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/user/${userId}`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    if (!response.ok)
        throw new Error(
            "Failed loading conversations"
        );

    return response.json();
}

export async function getOrCreateConversation(
    user1Id,
    user2Id,
    carId
) {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/get-or-create`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                user1Id,
                user2Id,
                carId
            })
        }
    );

    if (!response.ok)
        throw new Error(
            "Failed to create conversation"
        );

    return response.json();
}