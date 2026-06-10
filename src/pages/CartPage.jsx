// src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BrowseCar from "../components/layout/BrowseCar";
import Button from "../components/ui/Button";
import {
    getCartCars,
    removeFromCart
} from "../services/cartService";

export default function CartPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        try {
            setLoading(true);
            const data = await getCartCars();
            setCars(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(carId) {
        try {
            await removeFromCart(carId);
            setCars(prev => prev.filter(c => (c.carId || c.id) !== carId));
        } catch (error) {
            alert(error.message || "Помилка видалення");
        }
    }

    function handleMakeOrder(carId) {

        navigate(`/checkout/${carId}`);
    }

    return (
        <>
            <Navbar />
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
                <h1 className="auth-title" style={{ marginBottom: "8px" }}>
                    Your Cart
                </h1>
                <p style={{ color: "var(--car-muted)", marginBottom: "32px" }}>
                    {cars.length} items in cart
                </p>

                {loading ? (
                    <p style={{ textAlign: "center", padding: "60px", color: "var(--car-muted)" }}>
                        Завантаження...
                    </p>
                ) : cars.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "80px", color: "var(--car-muted)" }}>
                        Корзина порожня
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
                                            variant="secondary"
                                            className="btn-icon"
                                            onClick={() => handleMakeOrder(car.carId || car.id)}
                                            title="Make an Order"
                                        >
                                            🤝
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="btn-icon"
                                            onClick={() => handleRemove(car.carId || car.id)}
                                            title="Remove from Cart"
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