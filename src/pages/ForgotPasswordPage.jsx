import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {

            await forgotPassword(email);

            setSuccess("Password reset link has been sent to your email.");

        } catch (error) {

            setError(error.message || "Failed to send reset link.");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <Card
                className="auth-card"
                style={{
                    maxWidth: "440px",
                    width: "100%"
                }}
            >

                <div className="auth-logo">
                    <div className="auth-logo-dot"></div>
                    Car Trading Shop
                </div>

                <h2 className="auth-title">
                    Forgot Password
                </h2>

                <p className="auth-subtitle">
                    Enter your email and we’ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit}>

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon="✉️"
                        required
                    />

                    {success && (
                        <div
                            className="alert alert-success"
                            style={{ marginBottom: "14px" }}
                        >
                            {success}
                        </div>
                    )}

                    {error && (
                        <div
                            className="alert alert-danger"
                            style={{ marginBottom: "14px" }}
                        >
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            marginTop: "8px"
                        }}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </Button>

                </form>

                <div className="auth-link">

                    Remember your password?{" "}

                    <span
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </span>

                </div>

            </Card>

        </div>
    );
}