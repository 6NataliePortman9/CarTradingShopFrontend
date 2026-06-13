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

    const userId =
        Number(localStorage.getItem("userId"));

    useEffect(() => {
        loadUnread();

        const interval =
            setInterval(loadUnread, 5000);

        return () => clearInterval(interval);
    }, []);

    async function loadUnread() {
        try {
            const count =
                await getUnreadCount(userId);

            setUnreadCount(count);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <nav className="navbar-preview">

            {/* ===== TOP ROW ===== */}
            <div className="navbar-top">

                <button
                    className="nav-brand-btn"
                    onClick={() => navigate("/about")}
                >
                    <img
                        src={logo}
                        alt="CTS"
                        className="nav-logo"
                    />
                </button>

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/browse")}
                    title="Home"
                >
                    🏠
                </Button>

                <input
                    type="text"
                    placeholder="Search cars..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                <Button
                    className="btn-icon"
                    variant="primary"
                    onClick={() => onSearch(searchTerm)}
                >
                    🔍
                </Button>

            </div>

            {/* ===== DESKTOP ACTIONS ===== */}
            <div className="nav-actions desktop-actions">

                <Button
                    className="btn-icon"
                    variant="primary"
                    onClick={onOpenFilters}
                >
                    🎛️
                </Button>

                <Button
                    className="btn-icon"
                    variant="primary"
                    onClick={onOpenSellModal}
                >
                    🏷️
                </Button>

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
                        unreadCount > 0 &&
                        (
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

            {/* ===== MOBILE BOTTOM BAR ===== */}
            <div className="mobile-bottom-nav">

                <Button
                    className="btn-icon"
                    variant="primary"
                    onClick={onOpenSellModal}
                >
                    🏷️
                </Button>

                <Button
                    className="btn-icon"
                    variant="primary"
                    onClick={onOpenFilters}
                >
                    🎛️
                </Button>

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
                        unreadCount > 0 &&
                        (
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

        </nav>
    );
}