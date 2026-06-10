// src/components/filters/CarFilterModal.jsx

import { useState } from "react";

import Button from "../ui/Button";

import "./CarFilterModal.css";

export default function CarFilterModal({ isOpen, onClose, onApplyFilters, initialFilters = {} }) {
    const [filters, setFilters] = useState({
        minCarPrice: "",
        maxCarPrice: "",
        minYearOfIssue: "",
        maxYearOfIssue: "",
        carLocation: "",
        carCondition: "",
        carGearBox: "",
        ...initialFilters
    });

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        // Заборона від’ємних значень
        if (
            [
                "minCarPrice",
                "maxCarPrice",
                "minYearOfIssue",
                "maxYearOfIssue"
            ].includes(name)
        ) {

            if (Number(value) < 0) {
                return;
            }
        }

        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleApply = () => {

        // Валідація min/max price
        if (
            filters.minCarPrice &&
            filters.maxCarPrice &&
            Number(filters.minCarPrice) > Number(filters.maxCarPrice)
        ) {
            alert("Min price cannot be greater than Max price");
            return;
        }

        // Валідація year
        if (
            filters.minYearOfIssue &&
            filters.maxYearOfIssue &&
            Number(filters.minYearOfIssue) > Number(filters.maxYearOfIssue)
        ) {
            alert("Min year cannot be greater than Max year");
            return;
        }

        onApplyFilters(filters);

        onClose();
    };

    const handleReset = () => {

        setFilters({
            minCarPrice: "",
            maxCarPrice: "",
            minYearOfIssue: "",
            maxYearOfIssue: "",
            carLocation: "",
            carCondition: "",
            carGearBox: ""
        });
    };

    return (
        <div className="filter-overlay">

            <div className="filter-modal">

                {/* HEADER */}
                <div className="filter-header">

                    <div>
                        <h2>Filter Cars</h2>
                        <p>Customize your search</p>
                    </div>

                    <button
                        className="filter-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                {/* BODY */}
                <div className="filter-body">

                    {/* PRICE */}
                    <div className="filter-group">

                        <label>Price Range</label>

                        <div className="filter-row">

                            <input
                                type="number"
                                name="minCarPrice"
                                min="0"
                                placeholder="Min Price"
                                value={filters.minCarPrice}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="maxCarPrice"
                                min="0"
                                placeholder="Max Price"
                                value={filters.maxCarPrice}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    {/* YEAR */}
                    <div className="filter-group">

                        <label>Year of Issue</label>

                        <div className="filter-row">

                            <input
                                type="number"
                                name="minYearOfIssue"
                                min="0"
                                placeholder="From"
                                value={filters.minYearOfIssue}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="maxYearOfIssue"
                                min="0"
                                placeholder="To"
                                value={filters.maxYearOfIssue}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    {/* LOCATION */}
                    <div className="filter-group">

                        <label>Location</label>

                        <input
                            type="text"
                            name="carLocation"
                            placeholder="Enter city..."
                            value={filters.carLocation}
                            onChange={handleChange}
                        />

                    </div>

                    {/* CONDITION */}
                    <div className="filter-group">

                        <label>Condition</label>

                        <select
                            name="carCondition"
                            value={filters.carCondition}
                            onChange={handleChange}
                        >
                            <option value="">All</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>

                    </div>

                    {/* GEARBOX */}
                    <div className="filter-group">

                        <label>Gearbox</label>

                        <select
                            name="carGearBox"
                            value={filters.carGearBox}
                            onChange={handleChange}
                        >
                            <option value="">All</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                            <option value="SemiAutomatic">SemiAutomatic</option>
                        </select>

                    </div>

                </div>

                {/* FOOTER */}
                <div className="filter-footer">

                    <Button
                        variant="secondary"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleApply}
                    >
                        Apply Filters
                    </Button>

                </div>

            </div>

        </div>
    );
}