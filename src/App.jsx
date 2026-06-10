import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BrowseCarsPage from "./pages/BrowseCarsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CartPage from "./pages/CartPage";
import SelectedPage from "./pages/SelectedPage";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./components/UserProfile/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/browse" element={<BrowseCarsPage />} />

                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                />

                <Route path="/cart" element={<CartPage />} />

                <Route
                    path="/selected"
                    element={<SelectedPage />}
                />

                <Route
                    path="/notifications"
                    element={
                        <NotificationPage />
                    }
                />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/checkout/:carId" element={<CheckoutPage />} />

                import AboutPage from "./pages/AboutPage";

                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
