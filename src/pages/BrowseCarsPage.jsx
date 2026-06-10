// src/pages/BrowseCarsPage.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import BrowseCar from "../components/layout/BrowseCar";
import { SearchCars } from "../services/carService";
import CarFilterModal from "../components/filters/CarFilterModal";
import SellCarModal from "../components/modals/SellCarModal";
import ContactSellerModal from "../components/modals/ContactSellerModal";

import { API_BASE } from "../config/api";

export default function BrowseCarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        fetchCars();
    }, []);

    const [selectedCar, setSelectedCar] =
        useState(null);

    const [isContactOpen, setIsContactOpen] =
        useState(false);


    const fetchCars = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/cars`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }

            const data = await response.json();
            setCars(data);
        } catch (err) {
            console.error(err);
            setError("Не вдалося завантажити автомобілі. Спробуйте пізніше.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term) => {
        setCurrentSearchTerm(term);          // ← зберігаємо термін
        try {
            const data = await SearchCars({
                searchTerm: term,
                ...activeFilters             // ← зберігаємо активні фільтри
            });
            setCars(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApplyFilters = async (filters) => {
        setActiveFilters(filters);           // ← зберігаємо фільтри
        try {
            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== "")
            );

            const data = await SearchCars({
                searchTerm: currentSearchTerm,   // ← додаємо збережений термін
                ...cleanedFilters
            });
            setCars(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (error) {
        return (
            <>
                <Navbar
                    onSearch={handleSearch}
                    onOpenFilters={() => setIsFilterOpen(true)}
                    onOpenSellModal={() => setIsSellModalOpen(true)}
                />
                <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--car-danger)" }}>
                    <p>{error}</p>
                    <button onClick={fetchCars}>Спробувати ще раз</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar
                onSearch={handleSearch}
                onOpenFilters={() => setIsFilterOpen(true)}
                onOpenSellModal={() => setIsSellModalOpen(true)}
            />
            <div style={{ padding: "20px 24px", maxWidth: "1400px", margin: "0 auto" }}>
                <h1 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "32px",
                    marginBottom: "8px"
                }}>
                    Browse Cars
                </h1>
                <p style={{ color: "var(--car-muted)", marginBottom: "32px" }}>
                    Found {cars.length} listings
                </p>

                {cars.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "60px", color: "var(--car-muted)" }}>
                        Наразі немає оголошень
                    </p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "24px"
                    }}>
                        {cars.map(car => (
                            <BrowseCar
                                key={car.carId || car.CarId}
                                car={car}
                                onContactSeller={(car) => {

                                    setSelectedCar(car);

                                    setIsContactOpen(true);
                                }}
                                onAddToSelected={(car) => alert(`Додано ${car.CarMarka} ${car.CarName} до вибраного`)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <CarFilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={activeFilters}
            />
            <ContactSellerModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                car={selectedCar}
            />
            <SellCarModal
                isOpen={isSellModalOpen}
                onClose={() => setIsSellModalOpen(false)}
                onCreated={fetchCars}
            />
        </>
    );
}