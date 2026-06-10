import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { login } from "../services/authService";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);
            console.log("LOGIN RESULT:", result);
            localStorage.setItem("token", result.userToken);
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("user", JSON.stringify(result));
            navigate("/browse", { replace: true });
        } catch (err) {
            setError(err.message || "Невірний email або пароль");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="auth-page">
            <Card className="auth-card" style={{ maxWidth: "420px", margin: "40px auto" }}>
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to your account</p>

                <form onSubmit={handleLogin}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon="✉️"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon="🔒"
                        required
                    />

                    <div
                        className="auth-link"
                        style={{
                            marginTop: "14px",
                            textAlign: "center"
                        }}
                    >
                        <span
                            onClick={() => navigate("/forgot-password")}
                            style={{
                                cursor: "pointer"
                            }}
                        >
                            Forgot password?
                        </span>
                    </div>

                    {error && (
                        <div
                            className="input-error"
                            style={{ marginBottom: "12px" }}
                        >
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", marginTop: "8px" }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="auth-link" style={{ marginTop: "20px" }}>
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
                        Sign up
                    </span>
                </div>

               

            </Card>

        </div>
    );
}