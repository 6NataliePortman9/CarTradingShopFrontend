export default function Alert({ children, variant = 'info', className = '' }) {
    return (
        <div className={`alert alert-${variant} ${className}`}>
            {children}
        </div>
    );
}