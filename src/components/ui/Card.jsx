// src/components/ui/Card.jsx
import './Card.css';

export default function Card({
    children,
    variant = 'default',
    className = '',
    ...props
}) {
    return (
        <div
            className={`card ${variant === 'accent' ? 'card-accent' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}