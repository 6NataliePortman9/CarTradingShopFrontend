// src/pages/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import "./CheckoutPage.css";

import { API_BASE } from "../config/api";
//const API_BASE = "https://cartradingshopapi20260609212931-hbfpetcbhrc9bzhc.swedencentral-01.azurewebsites.net";

const PLACEHOLDER =
    "https://placehold.co/600x400?text=No+Image";

const gearBoxMap = { 0: "Manual", 1: "Automatic", 2: "Semi-Automatic" };
const conditionMap = { 0: "New", 1: "Used" };

// TypeOfPaymentType — значення мають відповідати enum на бекенді
const PAYMENT_TYPES = [
    { value: 0, label: "Cash" },
    { value: 1, label: "Bank Transfer" },
    { value: 2, label: "Credit Card" },
];

export default function CheckoutPage() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const buyerId = Number(localStorage.getItem("userId"));

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [orderExists, setOrderExists] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        city: "",
        address: "",
        zipCode: "",
        comment: "",
        typeOfPayment: 0,
    });

    useEffect(() => { loadCar(); checkOrderExists(); }, [carId]);

    async function loadCar() {
        try {

            const res = await fetch(
                `${API_BASE}/api/cars/${carId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!res.ok)
                throw new Error("Failed loading car");

            const data = await res.json();

            console.log("CAR DATA:", data);

            setCar(data);

        } catch (err) {

            console.error(err);

            setError("Failed to load car details.");

        } finally {

            setLoading(false);
        }
    }

    async function checkOrderExists() {
        try {

            const res = await fetch(
                `${API_BASE}/api/orders/exists/${carId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!res.ok)
                throw new Error();

            const exists = await res.json();

            setOrderExists(exists);

            if (exists) {
                setError(
                    "You have already placed an order for this vehicle."
                );
            }

        } catch (err) {

            console.error(
                "Failed to check existing order",
                err
            );
        }
    }
    function handleChange(e) {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!car) return;

        if (orderExists) {

            setError(
                "You have already placed an order for this vehicle."
            );

            return;
        }

        // sellerId береться з машини: CarDtoGet.UserId = SellerId (див. CarMapper)
        const sellerId = car.userId ?? car.sellerId;

        if (!sellerId) {
            setError("Cannot determine seller. Please try again.");
            return;
        }

        if (sellerId === buyerId) {
            setError("You cannot purchase your own car.");
            return;
        }

        // Збираємо BuyerLocation з полів адреси
        const buyerLocation = [form.address, form.city, form.zipCode]
            .filter(Boolean)
            .join(", ");

        const payload = {
            sellerId: sellerId,
            buyerId: buyerId,
            carId: Number(carId),
            buyerLocation: buyerLocation,
            buyerPhoneNumber: form.phoneNumber,
            typeOfPayment: Number(form.typeOfPayment),
            orderComments: form.comment || null,
        };

        try {
            setSubmitting(true);

            const res = await fetch(`${API_BASE}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Error ${res.status}`);
            }

            const order = await res.json();
            console.log("Order created:", order);
            setSuccess(true);
            setOrderExists(true);

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create order.");
        } finally {
            setSubmitting(false);
        }
    }

    /* ── SUCCESS SCREEN ── */
    if (success) {
        return (
            <>
                <Navbar />
                <div className="checkout-success">
                    <div className="checkout-success-icon">✅</div>
                    <h2>Order Confirmed!</h2>
                    <p>
                        Your order for <strong>{car?.carMarka} {car?.carName}</strong> has been
                        successfully placed. The seller will contact you shortly.
                    </p>
                    <button
                        className="checkout-back-btn"
                        onClick={() => navigate("/browse")}
                    >
                        Back to Browse
                    </button>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="checkout-loading">Loading...</div>
            </>
        );
    }

    const gearBoxText = typeof car?.carGearBox === "number" ? gearBoxMap[car.carGearBox] : car?.carGearBox || "—";
    const conditionText = typeof car?.carCondition === "number" ? conditionMap[car.carCondition] : car?.carCondition || "—";

    const images =
        Array.isArray(car?.imageUrl) &&
            car.imageUrl.length > 0
            ? car.imageUrl.map(img => {

                if (img.startsWith("http")) {
                    return img;
                }

                return `${API_BASE}${img}`;
            })
            : [PLACEHOLDER];

    const prevImage = () => {

        setActiveIdx(i =>
            (i - 1 + images.length) %
            images.length
        );
    };

    const nextImage = () => {

        setActiveIdx(i =>
            (i + 1) %
            images.length
        );
    };

    return (
        <>
            <Navbar />

            <div className="checkout-page">

                {/* ── LEFT — FORM ── */}
                <div className="checkout-left">
                    <h1>Checkout</h1>

                    {error && (
                        <div className="checkout-alert checkout-alert--error">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="checkout-form">

                        <div className="checkout-section-label">Personal Details</div>
                        <div className="checkout-grid">
                            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
                            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                            <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
                        </div>

                        <div className="checkout-section-label">Delivery Address</div>
                        <div className="checkout-grid">
                            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                            <input name="zipCode" placeholder="ZIP Code" value={form.zipCode} onChange={handleChange} required />
                        </div>
                        <input
                            name="address"
                            placeholder="Street Address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />

                        <div className="checkout-section-label">Payment Method</div>
                        <div className="checkout-payment-row">
                            {PAYMENT_TYPES.map(pt => (
                                <label
                                    key={pt.value}
                                    className={`checkout-payment-option${Number(form.typeOfPayment) === pt.value ? " active" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="typeOfPayment"
                                        value={pt.value}
                                        checked={Number(form.typeOfPayment) === pt.value}
                                        onChange={handleChange}
                                        style={{ display: "none" }}
                                    />
                                    {pt.label}
                                </label>
                            ))}
                        </div>

                        <div className="checkout-section-label">Comment</div>
                        <textarea
                            rows={4}
                            name="comment"
                            placeholder="Any additional notes for the seller..."
                            value={form.comment}
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            className="checkout-submit-btn"
                            disabled={submitting || orderExists}
                        >
                            {orderExists
                                ? "Order Already Exists"
                                : submitting
                                    ? "Placing Order..."
                                    : "Confirm Order"}
                        </button>

                    </form>
                </div>

                {/* ── RIGHT — SUMMARY ── */}
                <div className="checkout-right">
                    <h2>Order Summary</h2>

                    <div className="checkout-car">
                        <div className="checkout-car-img-wrap">

                            <img
                                src={images[activeIdx]}
                                alt={`${car?.carMarka} ${car?.carName}`}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        PLACEHOLDER;
                                }}
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="checkout-img-nav checkout-img-nav--prev"
                                        onClick={prevImage}
                                    >
                                        ‹
                                    </button>

                                    <button
                                        type="button"
                                        className="checkout-img-nav checkout-img-nav--next"
                                        onClick={nextImage}
                                    >
                                        ›
                                    </button>

                                    <div className="checkout-img-counter">
                                        {activeIdx + 1}
                                        {" / "}
                                        {images.length}
                                    </div>

                                    <div className="checkout-img-dots">

                                        {images.map((_, i) => (

                                            <button
                                                key={i}
                                                type="button"
                                                className={
                                                    i === activeIdx
                                                        ? "checkout-dot active"
                                                        : "checkout-dot"
                                                }
                                                onClick={() =>
                                                    setActiveIdx(i)
                                                }
                                            />

                                        ))}

                                    </div>
                                </>
                            )}

                        </div>

                        <div className="checkout-car-title">{car?.carMarka} {car?.carName}</div>
                        <div className="checkout-car-year">{car?.yearOfIssue}</div>

                        <div className="checkout-summary-row"><span>Condition</span><span>{conditionText}</span></div>
                        <div className="checkout-summary-row"><span>Gearbox</span><span>{gearBoxText}</span></div>
                        <div className="checkout-summary-row"><span>Location</span><span>{car?.carLocation || "—"}</span></div>
                        <div className="checkout-summary-row"><span>Plate / VIN</span><span>{car?.carNumber || "—"}</span></div>

                        <div className="checkout-price-row">
                            <span className="checkout-price-label">Total</span>
                            <span className="checkout-price">
                                ${Number(car?.carPrice || 0).toLocaleString()}
                            </span>
                        </div>

                        <div className="checkout-secure-note">🔒 Secure checkout</div>
                    </div>
                </div>

            </div>
        </>
    );
}