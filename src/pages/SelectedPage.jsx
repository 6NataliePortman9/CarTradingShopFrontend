// src/pages/SelectedPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import BrowseCar from "../components/layout/BrowseCar";
import Button from "../components/ui/Button";

import {
    getSelectedCars,
    removeFromSelected
} from "../services/selectedService";

import { addToCart } from "../services/cartService";

export default function SelectedPage() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        try {
            setLoading(true);
            const data = await getSelectedCars();
            setCars(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(carId) {
        await removeFromSelected(carId);
        setCars(prev => prev.filter(c => (c.carId || c.id) !== carId));
    }

    async function handleMoveToCart(carId) {
        try {
            await addToCart(carId);
            alert("Авто успішно додано в корзину!");
            // Опціонально: видаляємо зі збережених після додавання в корзину
            await removeFromSelected(carId);
            loadCars();
        } catch (error) {
            alert(error.message || "Помилка при додаванні в корзину");
        }
    }

    return (
        <>
            <Navbar />
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
                <h1 className="auth-title" style={{ marginBottom: "8px" }}>
                    Saved Cars
                </h1>
                <p style={{ color: "var(--car-muted)", marginBottom: "32px" }}>
                    {cars.length} saved listings
                </p>

                {loading ? (
                    <p style={{ textAlign: "center", padding: "60px", color: "var(--car-muted)" }}>
                        Завантаження...
                    </p>
                ) : cars.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "80px", color: "var(--car-muted)" }}>
                        У вас поки немає збережених автомобілів
                    </p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "24px"
                    }}>
                        {cars.map(car => (
                            <BrowseCar
                                key={car.carId || car.id}
                                car={car}
                                showCartButton={false}
                                showSelectedButton={false}
                                customActions={
                                    <>
                                        <Button
                                            variant="primary"
                                            className="btn-icon"
                                            onClick={() => handleMoveToCart(car.carId || car.id)}
                                            title="Move to Cart"
                                        >
                                            🛒
                                        </Button>

                                        <Button
                                            variant="danger"
                                            className="btn-icon"
                                            onClick={() => handleRemove(car.carId || car.id)}
                                            title="Remove"
                                        >
                                            ✕
                                        </Button>
                                    </>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}