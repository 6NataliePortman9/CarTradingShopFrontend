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

    // НОВА ВЕРСІЯ
    function renderOrderAction(car) {

        const status =
            typeof car.carStatus === "number"
                ? ["Available", "Sold", "Reserved"][car.carStatus]
                : car.carStatus || "Available";

        if (status === "Sold") {
            return (
                <Button
                    variant="danger"
                    style={{
                        minWidth: "60px",
                        height: "48px",
                        fontWeight: "600",
                        borderRadius: "12px"
                    }}
                    disabled
                >
                    🚫 Sold
                </Button>
            );
        }

        if (status === "Reserved") {
            return (
                <Button
                    variant="secondary"
                    style={{
                        minWidth: "50px",
                        height: "48px",
                        fontWeight: "600",
                        borderRadius: "12px"
                    }}
                    disabled
                >
                    ⏳
                </Button>
            );
        }

        return (
            <Button
                variant="danger"
                className="btn-icon"
                style={{
                    minWidth: "50px",
                    height: "48px",
                    fontSize: "15px",
                    fontWeight: "600",
                    borderRadius: "12px"
                }}
                onClick={() =>
                    handleMakeOrder(car.carId || car.id)
                }
            >
                🤝
            </Button>
        );
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
