import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUnreadCount } from "../../services/notificationService";
import Button from "../ui/Button";

import logo from "../../assets/CTS2_after_paint-removebg-preview.png";

import "./Navbar.css";

export default function Navbar({ onSearch, onOpenFilters, onOpenSellModal }) {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [unreadCount, setUnreadCount] =
        useState(0);
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

        } catch (error) {

            console.error(error);
        }
    }

    return (
        <nav className="navbar-preview">

            {/* LOGO */}
            <button
                className="nav-brand-btn"
                onClick={() => navigate("/about")}  // було /browse
            >
                <img src={logo} alt="CTS" className="nav-logo" />
            </button>



            {/* SEARCH */}
            <div className="navbar-search">


                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/browse")}
                    title="Home browse page"
                >
                    🏠
                </Button>

                <input
                    type="text"
                    placeholder="Search cars..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Button
                    className="btn-icon"
                    variant="primary"
                    size="sm"
                    onClick={() => onSearch(searchTerm)}
                >
                    🔍
                </Button>

                <Button
                    className="btn-icon"
                    variant="primary"
                    size="sm"
                    onClick={onOpenFilters}
                >
                    🎛️
                </Button>

                <Button
                    className="btn-icon"
                    variant="primary"
                    size="sm"
                    onClick={onOpenSellModal}
                >
                    🏷️
                </Button>

            </div>

            {/* ACTIONS */}
            <div className="nav-actions">

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/cart")}
                    title="Cart"
                >
                    🛒
                </Button>

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/selected")}
                    title="Selected Cars"
                >
                    ❤️
                </Button>

                <div style={{ position: "relative" }}>

                    <Button
                        variant="primary"
                        className="btn-icon"
                        onClick={() => navigate("/notifications")}
                        title="Notifications"
                    >
                        💬
                    </Button>

                    {
                        unreadCount > 0 && (

                            <div
                                style={{
                                    position: "absolute",
                                    top: "-6px",
                                    right: "-6px",

                                    width: "20px",
                                    height: "20px",

                                    borderRadius: "50%",

                                    background: "red",

                                    color: "white",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    fontSize: "12px",
                                    fontWeight: "bold"
                                }}
                            >
                                {unreadCount}
                            </div>
                        )
                    }

                </div>

                <Button
                    variant="primary"
                    className="btn-icon"
                    onClick={() => navigate("/profile")}
                    title="Profile"
                >
                    👤
                </Button>

            </div>

        </nav>
    );
}