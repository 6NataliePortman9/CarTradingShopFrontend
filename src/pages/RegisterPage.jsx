import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import { register } from "../services/authService";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await register(formData);
            console.log("Registration successful", result);

            setToast({
                message: "Account created successfully! Please sign in.",
                variant: "success"
            });

            // Затримка перед редиректом щоб Toast встиг показатись
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);

        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card" style={{ maxWidth: "460px", margin: "40px auto" }}>
                <h2 className="auth-title">Create account</h2>
                <p className="auth-subtitle">Join thousands of buyers & sellers</p>

                <form onSubmit={handleRegister}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <Input
                            label="First Name"
                            type="text"
                            name="userFirstName"
                            placeholder="John"
                            value={formData.userFirstName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            name="userLastName"
                            placeholder="Doe"
                            value={formData.userLastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        label="Email Address"
                        type="email"
                        name="userEmail"
                        placeholder="you@example.com"
                        value={formData.userEmail}
                        onChange={handleChange}
                        icon="✉️"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="userPassword"
                        placeholder="Min. 8 characters"
                        value={formData.userPassword}
                        onChange={handleChange}
                        icon="🔒"
                        required
                    />

                    {error && (
                        <div className="input-error" style={{ marginBottom: "12px" }}>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", marginTop: "16px" }}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>

                <div className="auth-link" style={{ marginTop: "20px" }}>
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                        Sign in
                    </span>
                </div>
            </Card>

            {toast && (
                <Toast
                    message={toast.message}
                    variant={toast.variant}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}