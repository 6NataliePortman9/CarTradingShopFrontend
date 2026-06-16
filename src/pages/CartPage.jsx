// src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BrowseCar from "../components/layout/BrowseCar";
import Button from "../components/ui/Button";
import ContactSellerModal from "../components/modals/ContactSellerModal";
import { getCartCars, removeFromCart } from "../services/cartService";
import { API_BASE } from "../config/api";

export default function CartPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        try {
            setLoading(true);

            const data = await getCartCars();

            const token = localStorage.getItem("token");

            const fullCars = await Promise.all(
                data.map(async (car) => {
                    const id = car.carId || car.id;

                    const res = await fetch(
                        `${API_BASE}/api/cars/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    return res.ok
                        ? await res.json()
                        : car;
                })
            );

            setCars(fullCars);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    async function handleRemove(carId) {
        try {

            await removeFromCart(carId);

            setCars(prev =>
                prev.filter(
                    c => (c.carId || c.id) !== carId
                )
            );

        } catch (error) {

            alert(error.message || "Помилка видалення");
        }
    }

    function handleMakeOrder(carId) {
        navigate(`/checkout/${carId}`);
    }

    function renderOrderAction(car) {

        const status =
            typeof car.carStatus === "number"
                ? ["Available", "Sold", "Reserved"][car.carStatus]
                : car.carStatus;

        if (status === "Available") {
            return (
                <Button
                    variant="secondary"
                    className="btn-icon"
                    onClick={() =>
                        handleMakeOrder(car.carId || car.id)
                    }
                    title="Make an Order"
                >
                    🤝
                </Button>
            );
        }

        if (status === "Sold") {
            return (
                <div
                    title="This vehicle has already been sold"
                    style={{
                        minWidth: "90px",
                        height: "42px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        background: "rgba(255, 59, 59, 0.15)",
                        border: "1px solid rgba(255, 59, 59, 0.4)",
                        color: "#ff5c5c",
                        fontWeight: "700",
                        fontSize: "14px",
                        padding: "0 12px"
                    }}
                >
                    🚫 Sold
                </div>
            );
        }

        if (status === "Reserved") {
            return (
                <div
                    title="This vehicle is currently reserved"
                    style={{
                        minWidth: "110px",
                        height: "42px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        background: "rgba(255, 174, 0, 0.15)",
                        border: "1px solid rgba(255, 174, 0, 0.4)",
                        color: "#ffb84d",
                        fontWeight: "700",
                        fontSize: "14px",
                        padding: "0 12px"
                    }}
                >
                    ⏳ Reserved
                </div>
            );
        }

        return null;
    }

    return (
        <>
            <Navbar />

            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "24px"
                }}
            >
                <h1
                    className="auth-title"
                    style={{ marginBottom: "8px" }}
                >
                    Your Cart
                </h1>

                <p
                    style={{
                        color: "var(--car-muted)",
                        marginBottom: "32px"
                    }}
                >
                    {cars.length} items in cart
                </p>

                {loading ? (

                    <p
                        style={{
                            textAlign: "center",
                            padding: "60px",
                            color: "var(--car-muted)"
                        }}
                    >
                        Завантаження...
                    </p>

                ) : cars.length === 0 ? (

                    <p
                        style={{
                            textAlign: "center",
                            padding: "80px",
                            color: "var(--car-muted)"
                        }}
                    >
                        Корзина порожня
                    </p>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: "24px"
                        }}
                    >
                        {cars.map(car => (

                            <BrowseCar
                                key={car.carId || car.id}
                                car={car}
                                onContactSeller={(car) => {
                                    setSelectedCar(car);
                                    setIsContactOpen(true);
                                }}
                                showCartButton={false}
                                showSelectedButton={false}
                                customActions={
                                    <>
                                        {renderOrderAction(car)}

                                        <Button
                                            variant="danger"
                                            className="btn-icon"
                                            onClick={() =>
                                                handleRemove(
                                                    car.carId || car.id
                                                )
                                            }
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

            <ContactSellerModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                car={selectedCar}
            />
        </>
    );
}
