import { API_BASE } from "../config/api";

const BASE_URL = `${API_BASE}/api/CardedCar`;

export async function addToCart(carId) {

    const token = localStorage.getItem("token");

    const response = await fetch(BASE_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            carId
        })
    });

    if (!response.ok) {

        const text = await response.text();

        throw new Error(text || "Failed to add");
    }
}

export async function getCartCars() {
    const token = localStorage.getItem("token");
    const response = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    // Нормалізація: витягуємо вкладений об'єкт car якщо є
    return data.map(item => item.car ?? item);
}

export async function removeFromCart(carId) {

    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/${carId}`, {

        method: "DELETE",

        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}