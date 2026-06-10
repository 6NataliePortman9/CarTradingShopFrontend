import { API_BASE } from "../config/api";

const BASE_URL =`${API_BASE}/api/Notification`;

export async function getConversationMessages(
    conversationId
) {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/conversation/${conversationId}`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    if (!response.ok)
        throw new Error(
            "Failed loading messages"
        );

    return response.json();
}

export async function getUnreadCount(userId) {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/unread-count/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok)
        throw new Error("Failed");

    return response.json();
}

export async function markConversationAsRead(
    conversationId,
    userId
) {

    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${BASE_URL}/mark-conversation-read?conversationId=${conversationId}&userId=${userId}`,
        {
            method: "PUT",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok)
        throw new Error("Failed marking as read");
}

export async function sendMessage(
    conversationId,
    senderId,
    message
) {

    const token =
        localStorage.getItem("token");

    const url =
        `${BASE_URL}/send?conversationId=${conversationId}&senderId=${senderId}&message=${encodeURIComponent(message)}`;

    console.log(url);

    const response = await fetch(
        url,
        {
            method: "POST",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        const text =
            await response.text();

        console.error(text);

        throw new Error(text);
    }
}