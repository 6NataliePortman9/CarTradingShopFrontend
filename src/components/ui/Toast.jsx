// src/components/ui/Toast.jsx
import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, variant = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 1000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast--${variant}`}>
            <div className="toast-content">
                {variant === "success" && <span>✅</span>}
                {variant === "danger" && <span>❌</span>}
                {variant === "info" && <span>ℹ️</span>}
                <span>{message}</span>
            </div>
            <button className="toast-close" onClick={onClose}>✕</button>
        </div>
    );
}