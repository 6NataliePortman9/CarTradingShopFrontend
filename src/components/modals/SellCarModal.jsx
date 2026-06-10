// src/components/SellCarModal.jsx
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createCar } from "../../services/carService";
import ImageUploader from "./ImageUploader";
import "./SellCarModal.css";

const carBrands = [
    "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Honda", 
    "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Skoda", 
    "Renault", "Peugeot", "Opel", "Mazda", "Lexus", "Porsche", 
    "Land Rover", "Jeep", "Volvo", "Subaru", "Mitsubishi", "Tesla",
    "Jaguar", "Mini", "Citroën", "Fiat", "Seat", "Suzuki", "Other"
].sort();

export default function SellCarModal({ isOpen, onClose, onCreated }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        carName: "",           // Model
        carMarka: "",          // Brand
        carPrice: "",
        yearOfIssue: "",
        carCondition: "Used",
        carLocation: "",
        carGearBox: "Manual",
        carOwnerTelephoneNumber: "",
        carNumber: "",
        carStatus: "Available",
        images: []
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            await createCar({
                ...formData,
                carPrice: Number(formData.carPrice),
                yearOfIssue: Number(formData.yearOfIssue)
            });
            onCreated?.();
            onClose();
        } catch (err) {
            setError(err.message || "Failed to create listing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sellcar-overlay" onClick={onClose}>
            <div className="sellcar-modal" onClick={e => e.stopPropagation()}>
                <div className="sellcar-header">
                    <div>
                        <h2 className="sellcar-title">Sell Your Car</h2>
                        <p className="sellcar-subtitle">Fill in the details of your vehicle</p>
                    </div>
                    <button className="sellcar-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="sellcar-form">
                    <div className="sellcar-grid">

                        {/* === Car Brand (Select) === */}
                        <div className="input-group">
                            <label className="input-label">Car Brand *</label>
                            <select
                                name="carMarka"
                                className="ds-select"
                                value={formData.carMarka}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select brand...</option>
                                {carBrands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Car Model */}
                        <div className="input-group">
                            <label className="input-label">Car Model *</label>
                            <Input
                                type="text"
                                name="carName"
                                placeholder="e.g. 320i, Camry, Tucson"
                                value={formData.carName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Price & Year */}
                        <Input
                            label="Price (USD) *"
                            type="number"
                            name="carPrice"
                            placeholder="25000"
                            value={formData.carPrice}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Year of Issue *"
                            type="number"
                            min="1900"
                            max="2026"
                            name="yearOfIssue"
                            placeholder="2022"
                            value={formData.yearOfIssue}
                            onChange={handleChange}
                            required
                        />

                        {/* Інші поля */}
                        <div className="input-group">
                            <label className="input-label">Condition</label>
                            <select name="carCondition" className="ds-select" value={formData.carCondition} onChange={handleChange}>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Gearbox</label>
                            <select name="carGearBox" className="ds-select" value={formData.carGearBox} onChange={handleChange}>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                                <option value="SemiAutomatic">Semi-Automatic</option>
                            </select>
                        </div>

                        <Input label="Location *" name="carLocation" value={formData.carLocation} onChange={handleChange} required />
                        <Input label="Phone Number *" type="tel" name="carOwnerTelephoneNumber" value={formData.carOwnerTelephoneNumber} onChange={handleChange} required />
                        <Input label="License Plate / VIN" name="carNumber" value={formData.carNumber} onChange={handleChange} required />

                        <div className="input-group">
                            <label className="input-label">Status</label>
                            <select name="carStatus" className="ds-select" value={formData.carStatus} onChange={handleChange}>
                                <option value="Available">Available</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Sold">Sold</option>
                            </select>
                        </div>
                    </div>

                    {/* Images Upload */}
                    <div className="input-group">
                        <label className="input-label">Photos (up to 10)</label>
                        <ImageUploader
                            onChange={(files) => setFormData(prev => ({ ...prev, images: files }))}
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="sellcar-actions">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating Listing..." : "Publish Listing"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}