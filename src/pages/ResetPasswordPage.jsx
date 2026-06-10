import { useSearchParams, useNavigate } from "react-router-dom";

import { useState } from "react";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }

        if (password.length < 6) {

            setError("Password must be at least 6 characters.");

            return;
        }

        try {

            setLoading(true);

            await resetPassword(token, password);

            setSuccess("Password updated successfully.");

            // AUTO REDIRECT
            setTimeout(() => {

                navigate("/login");

            }, 2000);

        } catch (error) {

            setError(error.message || "Failed to reset password.");

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
                    Reset Password
                </h2>

                <p className="auth-subtitle">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        icon="🔒"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        icon="🔒"
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
                            ? "Updating..."
                            : "Update Password"}
                    </Button>

                </form>

                <div className="auth-link">

                    Back to{" "}

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