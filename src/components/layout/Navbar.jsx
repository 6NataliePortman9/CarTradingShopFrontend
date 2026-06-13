import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUnreadCount } from "../../services/notificationService";
import Button from "../ui/Button";

import logo from "../../assets/CTS2_after_paint-removebg-preview.png";
import "./Navbar.css";

export default function Navbar({
    onSearch,
    onOpenFilters,
    onOpenSellModal
}) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);

    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        loadUnread();
        const interval = setInterval(loadUnread, 5000);
        return () => clearInterval(interval);
    }, []);

    async function loadUnread() {
        try {
            const count = await getUnreadCount(userId);
            setUnreadCount(count);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <nav className="navbar-preview">
                <div className="navbar-container">

                    {/* LEFT SIDE - Logo / About */}
                    <div className="navbar-left">
                        <button
                            className="nav-brand-btn"
                            onClick={() => navigate("/about")}
                        >
                            <img src={logo} alt="CTS" className="nav-logo" />
                        </button>
                    </div>

                    {/* CENTER - Search */}
                    <div className="navbar-center">
                        <div className="navbar-search">
                            <input
                                type="text"
                                placeholder="Search cars by make, model or year..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
                            />
                            <Button
                                className="btn-icon search-btn"
                                variant="primary"
                                onClick={() => onSearch(searchTerm)}
                            >
                                🔍
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Actions */}
                    <div className="navbar-right">
                        <Button
                            variant="ghost"
                            className="btn-icon mobile-optional"
                            onClick={onOpenFilters}
                            title="Filters"
                        >
                            🎛️
                        </Button>

                        <Button
                            variant="ghost"
                            className="btn-icon mobile-optional"
                            onClick={onOpenSellModal}
                            title="Sell Car"
                        >
                            🏷️
                        </Button>

                        {/* Desktop Actions */}
                        <div className="nav-actions desktop-only">
                            <Button
                                variant="ghost"
                                className="btn-icon"
                                onClick={() => navigate("/cart")}
                                title="Cart"
                            >
                                🛒
                            </Button>

                            <Button
                                variant="ghost"
                                className="btn-icon"
                                onClick={() => navigate("/selected")}
                                title="Selected"
                            >
                                ❤️
                            </Button>

                            <div className="notification-wrapper">
                                <Button
                                    variant="ghost"
                                    className="btn-icon"
                                    onClick={() => navigate("/notifications")}
                                    title="Notifications"
                                >
                                    💬
                                </Button>
                                {unreadCount > 0 && (
                                    <div className="notification-badge">
                                        {unreadCount}
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                className="btn-icon"
                                onClick={() => navigate("/profile")}
                                title="Profile"
                            >
                                👤
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE BOTTOM NAVIGATION */}
            <div className="mobile-bottom-nav">

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/cart")}
                >
                    🛒
                </Button>

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/selected")}
                >
                    ❤️
                </Button>

                <div className="notification-wrapper">

                    <Button
                        variant="primary"
                        className="btn-icon"
                        onClick={() =>
                            navigate("/notifications")
                        }
                    >
                        💬
                    </Button>

                    {
                        unreadCount > 0 && (
                            <div className="notification-badge">
                                {unreadCount}
                            </div>
                        )
                    }

                </div>

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/profile")}
                >
                    👤
                </Button>

            </div>
        </>
    );
}