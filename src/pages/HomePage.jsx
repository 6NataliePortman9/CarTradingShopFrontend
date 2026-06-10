// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="hero-preview">
                <div className="hero-bg-glow"></div>

                <div className="hero-eyebrow">
                    ✦ CarTraidingShop ✦
                </div>

                <h1 className="hero-headline">
                    <br />
                    <em>All cars in your hands</em>
                </h1>

                <p className="hero-desc">
                    Thousands of verified listings from trusted sellers.
                    Find your perfect car or sell quickly and safely.
                </p>
            </div>

            {/* Quick Actions Card */}
            <Card style={{
                maxWidth: "420px",
                margin: "40px auto",
                textAlign: "center",
                padding: "40px 32px"
            }}>
                <h2 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "28px",
                    marginBottom: "12px"
                }}>
                    Already a member?
                </h2>
                <p style={{
                    color: "var(--car-muted)",
                    marginBottom: "28px",
                    fontSize: "15px"
                }}>
                    Sign in to manage your listings and saved cars
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Button
                        size="lg"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => navigate("/register")}
                    >
                        Create New Account
                    </Button>
                </div>
            </Card>
        </div>
    );
}