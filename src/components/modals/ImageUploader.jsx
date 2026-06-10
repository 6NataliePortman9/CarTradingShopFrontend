// src/components/ImageUploader.jsx
import { useState, useRef } from "react";
import Button from "../ui/Button";
import "./ImageUploader.css";

export default function ImageUploader({ onChange, maxImages = 10 }) {
    const [images, setImages] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const addFiles = (files) => {
        const newFiles = Array.from(files)
            .filter(file => file.type.startsWith("image/"))
            .slice(0, maxImages - images.length);

        if (newFiles.length === 0) return;

        const newPreviews = newFiles.map(file => ({
            type: "file",
            file,
            preview: URL.createObjectURL(file)
        }));

        const updated = [...images, ...newPreviews];
        setImages(updated);
        onChange(updated.filter(img => img.type === "file").map(img => img.file));
    };

    const addUrl = () => {
        const trimmed = urlInput.trim();
        if (!trimmed) return;

        const updated = [...images, {
            type: "url",
            url: trimmed,
            preview: trimmed
        }];

        setImages(updated);
        setUrlInput("");
        onChange(updated.filter(img => img.type === "file").map(img => img.file));
    };

    const removeImage = (index) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
        onChange(updated.filter(img => img.type === "file").map(img => img.file));
    };

    return (
        <div className="uploader">
            {/* Головні кнопки з відстанню між ними */}
            <div className="uploader-buttons">
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => fileInputRef.current.click()}
                    style={{ flex: 1 }}
                >
                    📁 Upload from Device
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => document.getElementById('url-input').focus()}
                    style={{ flex: 1 }}
                >
                    🔗 Paste Image URL
                </Button>
            </div>

            {/* Drag & Drop зона */}
            <div
                className={`uploader-zone ${dragOver ? 'uploader-zone--active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current.click()}
            >
                <i className="ti ti-cloud-upload" style={{ fontSize: "32px", color: "var(--car-muted)" }} />
                <p>Drag & drop images here or click to browse</p>
                <p style={{ fontSize: "13px", color: "var(--car-muted)" }}>
                    PNG, JPG, WEBP • Maximum {maxImages} images
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {/* Поле для URL */}
            <div className="uploader-url-row">
                <input
                    id="url-input"
                    type="url"
                    className="ds-input"
                    placeholder="https://example.com/car-photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addUrl();
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={addUrl}
                    disabled={!urlInput.trim()}
                    style={{ background: "var(--car-accent)", color: "#0A0C10", whiteSpace: "nowrap" }}
                >
                    Add URL
                </Button>
            </div>

            {/* Прев'ю зображень */}
            {images.length > 0 && (
                <div className="uploader-preview-grid">
                    {images.map((img, index) => (
                        <div key={index} className="uploader-preview-item">
                            <img
                                src={img.preview}
                                alt={`preview ${index}`}
                                className="uploader-preview-img"
                            />
                            {img.type === "url" && <span className="uploader-url-badge">URL</span>}
                            <button
                                type="button"
                                className="uploader-remove-btn"
                                onClick={() => removeImage(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <p className="uploader-counter">
                    {images.length} / {maxImages} images
                </p>
            )}
        </div>
    );
}