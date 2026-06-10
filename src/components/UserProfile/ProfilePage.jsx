// src/pages/ProfilePage.jsx

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import "./ProfilePage.css";

import { API_BASE } from "../../config/api";
//const API_BASE = "https://cartradingshopapi20260609212931-hbfpetcbhrc9bzhc.swedencentral-01.azurewebsites.net";

export default function ProfilePage() {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");

    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState(null);

    const [myCars, setMyCars] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showCars, setShowCars] = useState(false);

    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [editField, setEditField] = useState(null);

    const [form, setForm] = useState({
        userFirstName: "",
        userLastName: "",
        userGender: "",
        userDateOfBirth: "",
    });

    const [initialForm, setInitialForm] = useState({
        userFirstName: "",
        userLastName: "",
        userGender: "",
        userDateOfBirth: "",
    });

    const [editingCar, setEditingCar] = useState(null);

    const [carForm, setCarForm] = useState({
        carName: "",
        carMarka: "",
        carPrice: "",
        yearOfIssue: "",
        carCondition: "Used",
        carGearBox: "Manual",
        carLocation: "",
        carOwnerTelephoneNumber: "",
        carNumber: "",
        carStatus: "Available"
    });

    const [showOrders, setShowOrders] =
        useState(false);

    const [orders, setOrders] =
        useState([]);

    const [showPurchases, setShowPurchases] =
        useState(false);

    const [purchases, setPurchases] =
        useState([]);

    useEffect(() => {

        if (!userId || !token) {

            navigate("/login");

            return;
        }

        loadProfile();

    }, []);

    async function loadOrders() {

        const res = await fetch(
            `${API_BASE}/api/orders/seller`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!res.ok)
            throw new Error("Failed loading orders");

        setOrders(await res.json());
    }

    async function loadPurchases() {

        const res = await fetch(
            `${API_BASE}/api/orders/buyer`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!res.ok)
            throw new Error("Failed loading purchases");

        const data = await res.json();

        console.log("PURCHASES:", data);

        setPurchases(data);
    }

    async function togglePurchases() {

        try {

            if (!showPurchases) {

                await loadPurchases();
            }

            setShowPurchases(prev => !prev);
        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed loading purchases"
            );
        }
    }

    async function confirmOrder(orderId) {

        await fetch(
            `${API_BASE}/api/orders/${orderId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    orderStatus: 5
                })
            }
        );

        await loadOrders();
    }


    async function cancelOrder(orderId) {

        await fetch(
            `${API_BASE}/api/orders/${orderId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    orderStatus: 4
                })
            }
        );

        await loadOrders();
    }

    async function toggleOrders() {

        if (!showOrders) {

            await loadOrders();
        }

        setShowOrders(prev => !prev);
    }

    async function loadProfile() {

        try {

            setLoading(true);

            setErrorMsg("");

            const [userRes, imgRes] = await Promise.all([

                fetch(`${API_BASE}/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),

                fetch(`${API_BASE}/api/UserImage/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            if (!userRes.ok) {

                if (userRes.status === 401) {

                    localStorage.clear();

                    navigate("/login");

                    return;
                }

                throw new Error("Failed to load profile");
            }

            const userData = await userRes.json();

            setUser(userData);

            const profileData = {
                userFirstName: userData.userFirstName || "",
                userLastName: userData.userLastName || "",
                userGender: userData.userGender || "",
                userDateOfBirth:
                    userData.userDateOfBirth
                        ? userData.userDateOfBirth.split("T")[0]
                        : "",
            };

            setForm(profileData);

            setInitialForm(profileData);

            if (imgRes.ok) {

                const imgData = await imgRes.json();

                if (Array.isArray(imgData) && imgData.length > 0) {

                    setUserImage(
                        imgData[imgData.length - 1]
                    );
                }
            }

        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed to load profile."
            );
        }
        finally {

            setLoading(false);
        }
    }

    async function loadMyCars() {

        try {

            const res = await fetch(
                `${API_BASE}/api/cars/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!res.ok) {

                throw new Error("Failed loading cars");
            }

            const cars = await res.json();

            console.log(cars);

            setMyCars(cars);

        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed loading cars"
            );
        }
    }

    async function saveSingleField(field) {

        try {

            setSaving(true);

            setSuccessMsg("");
            setErrorMsg("");

            const payload = {
                [field]: form[field]
            };

            const res = await fetch(
                `${API_BASE}/api/users/${userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {

                throw new Error("Failed updating field");
            }

            setSuccessMsg(
                "Profile updated successfully"
            );

            setEditField(null);

            await loadProfile();

        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed saving changes"
            );
        }
        finally {

            setSaving(false);
        }
    }

    async function handleSaveChanges() {

        try {

            setSaving(true);

            setSuccessMsg("");
            setErrorMsg("");

            const payload = {
                userFirstName: form.userFirstName.trim(),
                userLastName: form.userLastName.trim(),
                userGender: form.userGender,
                userDateOfBirth: form.userDateOfBirth || null,
            };

            const res = await fetch(
                `${API_BASE}/api/users/${userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {

                throw new Error("Update failed");
            }

            setSuccessMsg(
                "Profile updated successfully!"
            );

            setEditField(null);

            await loadProfile();

        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed to save changes."
            );
        }
        finally {

            setSaving(false);
        }
    }

    async function handleImageUpload(e) {

        const file = e.target.files?.[0];

        if (!file) return;

        try {

            setUploadingImage(true);

            setSuccessMsg("");
            setErrorMsg("");

            const formData = new FormData();

            formData.append("userId", userId);
            formData.append("image", file);

            const res = await fetch(
                `${API_BASE}/api/UserImage/upload`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );

            if (!res.ok) {

                throw new Error("Image upload failed");
            }

            setSuccessMsg(
                "Profile image updated successfully"
            );

            await loadProfile();

        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed uploading image"
            );
        }
        finally {

            setUploadingImage(false);
        }
    }

    function handleSignOut() {

        localStorage.clear();

        navigate("/login");
    }

    async function toggleMyCars() {

        if (!showCars) {

            await loadMyCars();
        }

        setShowCars(prev => !prev);
    }

    function openEditCarModal(car) {

        setEditingCar(car);

        setCarForm({
            carName: car.carName || "",
            carMarka: car.carMarka || "",
            carPrice: car.carPrice || "",
            yearOfIssue: car.yearOfIssue || "",
            carCondition: car.carCondition || "Used",
            carGearBox: car.carGearBox || "Manual",
            carLocation: car.carLocation || "",
            carOwnerTelephoneNumber: car.carOwnerTelephoneNumber || "",
            carNumber: car.carNumber || "",
            carStatus: car.carStatus || "Available"
        });
    }

    function closeEditCarModal() {

        setEditingCar(null);
    }

    async function handleUpdateCar(e) {

        e.preventDefault();

        try {

            setSaving(true);

            setErrorMsg("");
            setSuccessMsg("");

            const payload = {
                carName: carForm.carName,
                carMarka: carForm.carMarka,
                carPrice: Number(carForm.carPrice),
                yearOfIssue: Number(carForm.yearOfIssue),
                carCondition: carForm.carCondition,
                carGearBox: carForm.carGearBox,
                carLocation: carForm.carLocation,
                carOwnerTelephoneNumber: carForm.carOwnerTelephoneNumber,
                carNumber: carForm.carNumber,
                
            };

            const res = await fetch(
                `${API_BASE}/api/cars/${editingCar.carId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {

                throw new Error("Failed updating car");
            }

            setSuccessMsg("Car updated successfully");

            closeEditCarModal();

            await loadMyCars();

        }
        catch (err) {

            console.error(err);

            setErrorMsg(
                err.message || "Failed updating car"
            );
        }
        finally {

            setSaving(false);
        }
    }

    const hasChanges =
        JSON.stringify({
            ...form,
            userFirstName: form.userFirstName.trim(),
            userLastName: form.userLastName.trim()
        })
        !==
        JSON.stringify({
            ...initialForm,
            userFirstName: initialForm.userFirstName.trim(),
            userLastName: initialForm.userLastName.trim()
        });

    const avatarUrl = userImage?.userImageUrl
        ? (
            userImage.userImageUrl.startsWith("http")
                ? userImage.userImageUrl
                : `${API_BASE}${userImage.userImageUrl}`
        )
        : null;

    const initials = user
        ? `${user.userFirstName?.[0] ?? ""}${user.userLastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="profile-loading">
                    Loading profile...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="profile-page">

                <aside className="profile-sidebar">

                    <div className="profile-avatar-wrap">

                        {avatarUrl ? (

                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="profile-avatar-img"
                                onError={e => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                        ) : (

                            <div className="profile-avatar-initials">
                                {initials}
                            </div>
                        )}

                        <div className="profile-avatar-glow" />

                    </div>

                    <div className="profile-name">
                        {user?.userFirstName} {user?.userLastName}
                    </div>

                    <div className="profile-email">
                        {user?.userEmail}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />

                    <button
                        className="profile-change-img-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                    >
                        {uploadingImage
                            ? "Uploading..."
                            : "Change Image"}
                    </button>

                    <div className="profile-sidebar-divider" />

                    <button
                        className="profile-mycars-btn"
                        onClick={toggleMyCars}
                    >
                        {showCars
                            ? "Hide My Cars"
                            : "My Cars"}

                        <span className="profile-mycars-count">
                            {myCars.length || ""}
                        </span>
                    </button>

                    <button
                        className="profile-orders-btn"
                        onClick={toggleOrders}
                    >
                        My Orders

                        {orders.length > 0 && (
                            <span className="profile-orders-count">
                                {orders.length}
                            </span>
                        )}
                    </button>

                    <button
                        className="profile-orders-btn"
                        onClick={togglePurchases}
                    >
                        My Purchases

                        {purchases.length > 0 && (
                            <span className="profile-orders-count">
                                {purchases.length}
                            </span>
                        )}
                    </button>

                    <button
                        className="profile-signout-btn"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>

                </aside>

                <main className="profile-main">

                    <div className="profile-section-title">
                        Personal Information
                    </div>

                    {successMsg && (
                        <div className="profile-alert profile-alert--success">
                            {successMsg}
                        </div>
                    )}

                    {errorMsg && (
                        <div className="profile-alert profile-alert--error">
                            {errorMsg}
                        </div>
                    )}

                    <ProfileField
                        label="First Name"
                        value={form.userFirstName}
                        isEditing={editField === "userFirstName"}
                        onEdit={() => setEditField("userFirstName")}
                        onCancel={() => setEditField(null)}
                        onSave={() => saveSingleField("userFirstName")}
                        onChange={value =>
                            setForm(prev => ({
                                ...prev,
                                userFirstName: value
                            }))
                        }
                    />

                    <ProfileField
                        label="Last Name"
                        value={form.userLastName}
                        isEditing={editField === "userLastName"}
                        onEdit={() => setEditField("userLastName")}
                        onCancel={() => setEditField(null)}
                        onSave={() => saveSingleField("userLastName")}
                        onChange={value =>
                            setForm(prev => ({
                                ...prev,
                                userLastName: value
                            }))
                        }
                    />

                    <div className="profile-field">

                        <div className="profile-field-label">
                            Email
                        </div>

                        <div className="profile-field-value readonly">
                            {user?.userEmail}
                        </div>

                        <span className="profile-field-readonly-tag">
                            Read only
                        </span>

                    </div>

                    <div className="profile-field">

                        <div className="profile-field-label">
                            Gender
                        </div>

                        {editField === "userGender" ? (

                            <select
                                className="profile-field-input"
                                value={form.userGender}
                                onChange={e =>
                                    setForm(prev => ({
                                        ...prev,
                                        userGender: e.target.value
                                    }))
                                }
                            >
                                <option value="">
                                    Select...
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Unknown">
                                    Prefer not to say
                                </option>

                            </select>

                        ) : (

                            <div className="profile-field-value">
                                {form.userGender || "—"}
                            </div>
                        )}

                        {editField === "userGender" ? (

                            <div style={{ display: "flex", gap: "8px" }}>

                                <button
                                    className="profile-field-change"
                                    onClick={() =>
                                        saveSingleField("userGender")
                                    }
                                >
                                    Save
                                </button>

                                <button
                                    className="profile-field-cancel"
                                    onClick={() => setEditField(null)}
                                >
                                    Cancel
                                </button>

                            </div>

                        ) : (

                            <button
                                className="profile-field-change"
                                onClick={() => setEditField("userGender")}
                            >
                                Change
                            </button>
                        )}

                    </div>

                    <ProfileField
                        label="Date of Birth"
                        value={form.userDateOfBirth}
                        displayValue={
                            form.userDateOfBirth
                                ? new Date(
                                    form.userDateOfBirth
                                ).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )
                                : "—"
                        }
                        isEditing={editField === "userDateOfBirth"}
                        onEdit={() => setEditField("userDateOfBirth")}
                        onCancel={() => setEditField(null)}
                        onSave={() => saveSingleField("userDateOfBirth")}
                        onChange={value =>
                            setForm(prev => ({
                                ...prev,
                                userDateOfBirth: value
                            }))
                        }
                        inputType="date"
                    />

                    {hasChanges && (

                        <div className="profile-save-row">

                            <button
                                className="profile-save-btn"
                                onClick={handleSaveChanges}
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>
                    )}

                    {showCars && (

                        <div className="profile-mycars-section">

                            <div
                                className="profile-section-title"
                                style={{ marginTop: 0 }}
                            >
                                My Listings
                            </div>

                            {myCars.length === 0 ? (

                                <p className="profile-empty">
                                    You have no active listings.
                                </p>

                            ) : (

                                <div className="profile-cars-grid">

                                    {myCars.map(car => (

                                        <div
                                            key={car.carId}
                                            className="profile-car-card"
                                        >

                                            <div className="profile-car-img">

                                                {car.imageUrl?.[0] ? (
                                                    <img
                                                        src={
                                                            car.imageUrl[0].startsWith("http")
                                                                ? car.imageUrl[0]
                                                                : `${API_BASE}${car.imageUrl[0]}`
                                                        }
                                                        alt={car.carName}
                                                        onError={e => {
                                                            e.currentTarget.src =
                                                                "https://placehold.co/600x400?text=No+Image";
                                                        }}
                                                    />
                                                ) : (
                                                    <span>🚗</span>
                                                )}

                                            </div>
                                            <div className="profile-car-info">

                                                <div className="profile-car-title">
                                                    {car.carMarka} {car.carName}
                                                </div>

                                                <div className="profile-car-sub">
                                                    {car.yearOfIssue}
                                                    {" • "}
                                                    {typeof car.carGearBox === "number"
                                                        ? ["Manual", "Automatic", "Semi-Automatic"][car.carGearBox]
                                                        : car.carGearBox}
                                                    {" • "}
                                                    {typeof car.carCondition === "number"
                                                        ? ["New", "Used"][car.carCondition]
                                                        : car.carCondition}
                                                </div>

                                                <div className="profile-car-meta">

                                                    <span className="profile-car-badge">
                                                        {car.carLocation}
                                                    </span>

                                                    <span className="profile-car-badge">
                                                        {car.carNumber}
                                                    </span>

                                                </div>

                                                <div className="profile-car-owner">
                                                    {car.carOwnerTelephoneNumber}
                                                </div>

                                                <div className="profile-car-price-row">

                                                    <div className="profile-car-price">
                                                        $
                                                        {Number(car.carPrice || 0).toLocaleString()}
                                                    </div>

                                                    <div
                                                        className={`profile-car-status profile-car-status--${(
                                                                typeof car.carStatus === "number"
                                                                    ? ["available", "sold", "reserved"][car.carStatus]
                                                                    : car.carStatus?.toLowerCase()
                                                            )
                                                            }`}
                                                    >
                                                        {
                                                            typeof car.carStatus === "number"
                                                                ? ["Available", "Sold", "Reserved"][car.carStatus]
                                                                : car.carStatus
                                                        }
                                                    </div>

                                                </div>

                                                <button
                                                    className="profile-edit-car-btn"
                                                    onClick={() => openEditCarModal(car)}
                                                >
                                                    Edit my car
                                                </button>

                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}
                    {editingCar && (

                        <div
                            className="editcar-overlay"
                            onClick={closeEditCarModal}
                        >

                            <div
                                className="editcar-modal"
                                onClick={e => e.stopPropagation()}
                            >

                                <div className="editcar-header">

                                    <div>

                                        <h2>Edit Car</h2>

                                        <p>
                                            Update your vehicle listing
                                        </p>

                                    </div>

                                    <button
                                        className="editcar-close"
                                        onClick={closeEditCarModal}
                                    >
                                        ✕
                                    </button>

                                </div>

                                <form
                                    className="editcar-form"
                                    onSubmit={handleUpdateCar}
                                >

                                    <div className="editcar-grid">

                                        <input
                                            className="profile-field-input"
                                            placeholder="Brand"
                                            value={carForm.carMarka}
                                            onChange={e =>
                                                setCarForm(prev => ({
                                                    ...prev,
                                                    carMarka: e.target.value
                                                }))
                                            }
                                            required
                                        />

                                        <input
                                            className="profile-field-input"
                                            placeholder="Model"
                                            value={carForm.carName}
                                            onChange={e =>
                                                setCarForm(prev => ({
                                                    ...prev,
                                                    carName: e.target.value
                                                }))
                                            }
                                            required
                                        />

                                        <input
                                            type="number"
                                            className="profile-field-input"
                                            placeholder="Price"
                                            value={carForm.carPrice}
                                            onChange={e =>
                                                setCarForm(prev => ({
                                                    ...prev,
                                                    carPrice: e.target.value
                                                }))
                                            }
                                            required
                                        />

                                        <input
                                            className="profile-field-input"
                                            placeholder="Location"
                                            value={carForm.carLocation}
                                            onChange={e =>
                                                setCarForm(prev => ({
                                                    ...prev,
                                                    carLocation: e.target.value
                                                }))
                                            }
                                            required
                                        />

                                        <select
                                            className="profile-field-input"
                                            value={carForm.carCondition}
                                            onChange={e =>
                                                setCarForm(prev => ({
                                                    ...prev,
                                                    carCondition: e.target.value
                                                }))
                                            }
                                        >
                                            <option value="New">
                                                New
                                            </option>

                                            <option value="Used">
                                                Used
                                            </option>

                                        </select>

                                        <select
                                            className="profile-field-input"
                                            value={carForm.carGearBox}
                                            onChange={e =>
                                                setCarForm(prev => ({
                                                    ...prev,
                                                    carGearBox: e.target.value
                                                }))
                                            }
                                        >
                                            <option value="Manual">
                                                Manual
                                            </option>

                                            <option value="Automatic">
                                                Automatic
                                            </option>

                                            <option value="SemiAutomatic">
                                                Semi Automatic
                                            </option>

                                        </select>

                                        

                                    </div>

                                    <div className="editcar-actions">

                                        <button
                                            type="button"
                                            className="profile-field-cancel"
                                            onClick={closeEditCarModal}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="profile-save-btn"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>
                    )}

                    {showOrders && (
                        <div
                            className="orders-overlay"
                            onClick={() => setShowOrders(false)}
                        >
                            <div className="orders-modal profile-orders-modal">
                                <div className="orders-header">
                                    <div>
                                        <h2>Incoming Orders</h2>

                                        <p
                                            style={{
                                                color: "var(--car-muted)",
                                                marginTop: "4px"
                                            }}
                                        >
                                            Manage purchase requests for your vehicles
                                        </p>
                                    </div>

                                    <button
                                        className="editcar-close"
                                        onClick={() => setShowOrders(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {orders.length === 0 ? (
                                    <p>No orders found.</p>
                                ) : (
                                        <div className="orders-grid">
                                            {orders.map(order => (

                                                <div
                                                    key={order.orderId}
                                                    className="profile-order-card"
                                                >

                                                    <div className="profile-order-top">

                                                        <div>

                                                            <div className="profile-order-label">
                                                                Vehicle
                                                            </div>

                                                            <div className="profile-order-car">
                                                                {`${order.carMarka ?? ""} ${order.carName ?? ""}`.trim() ||
                                                                    "Unknown Vehicle"}
                                                            </div>

                                                        </div>

                                                        <div
                                                            className={`profile-order-status ${order.orderStatus === 5
                                                                ? "confirmed"
                                                                : order.orderStatus === 4
                                                                        ? "cancelled"
                                                                        : "pending"
                                                                }`}
                                                        >
                                                            {
                                                                order.orderStatus === 5
                                                                    ? "Confirmed"
                                                                    : order.orderStatus === 4
                                                                        ? "Cancelled"
                                                                        : "Pending"
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="profile-order-divider" />

                                                    <div className="profile-order-info">

                                                        <div className="profile-order-row">
                                                            <span>Buyer</span>
                                                            <strong>{order.buyerName}</strong>
                                                        </div>

                                                        <div className="profile-order-row">
                                                            <span>Phone</span>
                                                            <strong>{order.buyerPhoneNumber}</strong>
                                                        </div>

                                                        <div className="profile-order-row">
                                                            <span>Location</span>
                                                            <strong>{order.buyerLocation}</strong>
                                                        </div>

                                                    </div>

                                                    {order.orderStatus !== 5 &&
                                                        order.orderStatus !== 4 && (

                                                            <div className="profile-order-actions">

                                                                <button
                                                                    className="profile-order-confirm"
                                                                    onClick={() =>
                                                                        confirmOrder(order.orderId)
                                                                    }
                                                                >
                                                                    Confirm Order
                                                                </button>

                                                                <button
                                                                    className="profile-order-cancel"
                                                                    onClick={() =>
                                                                        cancelOrder(order.orderId)
                                                                    }
                                                                >
                                                                    Cancel
                                                                </button>

                                                            </div>
                                                        )}

                                                </div>
                                            ))}
                                        </div>
                                )}
                            </div>
                        </div>
                    )}

                    {showPurchases && (

                        <div
                            className="orders-overlay"
                            onClick={() => setShowPurchases(false)}
                        >

                            <div
                                className="orders-modal profile-orders-modal"
                                onClick={e => e.stopPropagation()}
                            >

                                <div className="orders-header">

                                    <div>

                                        <h2>My Purchases</h2>

                                        <p
                                            style={{
                                                color: "var(--car-muted)",
                                                marginTop: "4px"
                                            }}
                                        >
                                            Cars you have ordered
                                        </p>

                                    </div>

                                    <button
                                        className="editcar-close"
                                        onClick={() =>
                                            setShowPurchases(false)
                                        }
                                    >
                                        ✕
                                    </button>

                                </div>

                                {purchases.length === 0 ? (

                                    <p>No purchases found.</p>

                                ) : (

                                    <div className="orders-grid">

                                        {purchases.map(order => (

                                            <div
                                                key={order.orderId}
                                                className="profile-order-card"
                                            >

                                                <div className="profile-order-top">

                                                    <div>

                                                        <div className="profile-order-label">
                                                            Car
                                                        </div>

                                                        <div className="profile-order-car">
                                                            {
                                                                `${order.carMarka ?? ""} ${order.carName ?? ""}`.trim()
                                                                || "Unknown Car"
                                                            }
                                                        </div>

                                                    </div>

                                                    <div
                                                        className={`profile-order-status ${order.orderStatus === 5
                                                                ? "confirmed"
                                                                : order.orderStatus === 4
                                                                    ? "cancelled"
                                                                    : "pending"
                                                            }`}
                                                    >
                                                        {
                                                            order.orderStatus === 5
                                                                ? "Confirmed"
                                                                : order.orderStatus === 4
                                                                    ? "Cancelled"
                                                                    : "Pending"
                                                        }
                                                    </div>

                                                </div>

                                                <div className="profile-order-divider" />

                                                <div className="profile-order-info">

                                                    <div className="profile-order-row">
                                                        <span>Seller</span>

                                                        <strong>
                                                            {order.sellerName}
                                                        </strong>
                                                    </div>

                                                    <div className="profile-order-row">
                                                        <span>Phone</span>

                                                        <strong>
                                                            {order.buyerPhoneNumber}
                                                        </strong>
                                                    </div>

                                                    <div className="profile-order-row">
                                                        <span>Location</span>

                                                        <strong>
                                                            {order.buyerLocation}
                                                        </strong>
                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </main>

            </div>
        </>
    );
}

function ProfileField({
    label,
    value,
    displayValue,
    isEditing,
    onEdit,
    onCancel,
    onSave,
    onChange,
    inputType = "text"
}) {

    return (

        <div className="profile-field">

            <div className="profile-field-label">
                {label}
            </div>

            {isEditing ? (

                <input
                    className="profile-field-input"
                    type={inputType}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    autoFocus
                />

            ) : (

                <div className="profile-field-value">
                    {displayValue ?? (value || "—")}
                </div>
            )}

            {isEditing ? (

                <div style={{ display: "flex", gap: "8px" }}>

                    <button
                        className="profile-field-change"
                        onClick={onSave}
                    >
                        Save
                    </button>

                    <button
                        className="profile-field-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                </div>

            ) : (

                <button
                    className="profile-field-change"
                    onClick={onEdit}
                >
                    Change
                </button>
            )}

        </div>
    );
}