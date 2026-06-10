export default function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    hint,
    icon,
    ...props
}) {
    return (
        <div className="input-group">
            {label && <div className="input-label">{label}</div>}

            <div className="input-icon-wrap" style={{ position: 'relative' }}>
                {icon && <span className="icon">{icon}</span>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`ds-input ${error ? 'error' : ''}`}
                    {...props}
                />
            </div>

            {error && <div className="input-error">{error}</div>}
            {hint && <div className="input-hint">{hint}</div>}
        </div>
    );
}