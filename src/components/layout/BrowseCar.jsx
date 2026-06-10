import { useState } from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import "./BrowseCar.css";

import { addToCart } from "../../services/cartService";
import { addToSelected } from "../../services/selectedService";

import { API_BASE } from "../../config/api";

const PLACEHOLDER = "https://placehold.co/600x400?text=No+Image";

const gearBoxMap = {
    0: "Manual",
    1: "Automatic",
    2: "Semi-Automatic"
};

const conditionMap = {
    0: "New",
    1: "Used"
};

const statusMap = {
    0: "Available",
    1: "Sold",
    2: "Reserved"
};


export default function BrowseCar({
    car,
    onContactSeller,
    showCartButton = true,
    showSelectedButton = true,
    customActions = null
}) {

    const handleAddToCart = async () => {

        try {

            await addToCart(car.carId || car.CarId);

            alert("Added to cart");

        } catch (error) {

            alert(error.message);
        }
    };

    const handleAddToSelected = async () => {

        try {

            await addToSelected(car.carId || car.CarId);

            alert("Added to selected");

        } catch (error) {

            alert(error.message);
        }
    };

    // BACKEND IMAGE SUPPORT
    // car.imageUrl -> array from backend
    const images =
        Array.isArray(car.imageUrl) && car.imageUrl.length > 0
            ? car.imageUrl.map(img => {

                // if already absolute url
                if (img.startsWith("http")) {
                    return img;
                }

                // backend relative path
                return `${API_BASE}${img}`;
            })
            : [PLACEHOLDER];

    const [activeIdx, setActiveIdx] = useState(0);

    const prevImage = (e) => {
        e.stopPropagation();

        setActiveIdx((i) =>
            (i - 1 + images.length) % images.length
        );
    };

    const nextImage = (e) => {
        e.stopPropagation();

        setActiveIdx((i) =>
            (i + 1) % images.length
        );
    };

    // Human readable enums
    const gearBoxText =
        typeof car.carGearBox === "number"
            ? gearBoxMap[car.carGearBox]
            : car.carGearBox || "Unknown";

    const conditionText =
        typeof car.carCondition === "number"
            ? conditionMap[car.carCondition]
            : car.carCondition || "Unknown";

    const statusText =
        typeof car.carStatus === "number"
            ? statusMap[car.carStatus]
            : car.carStatus || "Unknown";

    return (
        <div className="listing-card">

            {/* IMAGE GALLERY */}
            <div className="listing-img">

                <img
                    src={images[activeIdx]}
                    alt={`${car.carMarka} ${car.carName} — image ${activeIdx + 1}`}
                    onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />

                {images.length > 1 && (
                    <>
                        <button
                            className="img-nav img-nav--prev"
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>

                        <button
                            className="img-nav img-nav--next"
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            ›
                        </button>

                        {/* DOTS */}
                        <div className="img-dots">

                            {images.map((_, i) => (

                                <button
                                    key={i}
                                    className={
                                        `img-dot${i === activeIdx
                                            ? " img-dot--active"
                                            : ""
                                        }`
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveIdx(i);
                                    }}
                                    aria-label={`Image ${i + 1}`}
                                />

                            ))}

                        </div>

                        {/* COUNTER */}
                        <div className="img-counter">
                            {activeIdx + 1} / {images.length}
                        </div>
                    </>
                )}

            </div>

            {/* BODY */}
            <div className="listing-body">

                <div className="listing-title">
                    {car.carMarka} {car.carName}
                </div>

                <div className="listing-sub">
                    {car.yearOfIssue}
                    {" • "}
                    {gearBoxText}
                    {" • "}
                    {conditionText}
                </div>

                <div className="listing-meta">

                    {car.carLocation && (
                        <Badge variant="muted">
                            {car.carLocation}
                        </Badge>
                    )}

                    {car.carNumber && (
                        <Badge variant="accent">
                            {car.carNumber}
                        </Badge>
                    )}

                </div>

                <div className="listing-price-row">

                    <div className="listing-price">
                        ${Number(car.carPrice || 0).toLocaleString()}
                    </div>

                    <div
                        className={`listing-status listing-status--${statusText.toLowerCase()}`}
                    >
                        {statusText}
                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <div className="listing-footer">

                <Button
                    onClick={() => onContactSeller?.(car)}
                    style={{ flex: 1 }}
                >
                    Contact Seller
                </Button>

                {showCartButton && (
                    <Button
                        variant="primary"
                        className="btn-icon"
                        onClick={handleAddToCart}
                        title="Add to Cart"
                    >
                        🛒
                    </Button>
                )}

                {showSelectedButton && (
                    <Button
                        variant="primary"
                        className="btn-icon"
                        onClick={handleAddToSelected}
                        title="Add to Selected"
                    >
                        ❤️
                    </Button>
                )}

                {customActions}

            </div>

        </div>
    );
}