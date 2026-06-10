export function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">CarTradingShop</div>
                <h1 className="auth-title">{title}</h1>
                <p className="auth-subtitle">{subtitle}</p>
                {children}
            </div>
        </div>
    );
}