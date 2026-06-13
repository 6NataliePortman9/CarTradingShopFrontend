// src/pages/AboutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SellCarModal from "../components/modals/SellCarModal";
import "./AboutPage.css";

const STATS = [
    { value: "12K+", label: "Verified Listings" },
    { value: "8.4K", label: "Happy Buyers" },
    { value: "97%", label: "Satisfaction Rate" },
    { value: "4.9★", label: "Average Rating" },
];

const VALUES = [
    {
        icon: "🛡️",
        title: "Trust First",
        desc: "Every listing goes through a verification process. We don't list cars we wouldn't buy ourselves.",
    },
    {
        icon: "⚡",
        title: "Speed",
        desc: "From browsing to confirmed order in minutes. No phone trees, no dealership games.",
    },
    {
        icon: "🔍",
        title: "Transparency",
        desc: "Full history, honest condition labels, and real prices — no hidden fees ever.",
    },
    {
        icon: "🤝",
        title: "Community",
        desc: "We connect real people. Sellers and buyers communicate directly, building genuine trust.",
    },
];

const TEAM = [
    { initials: "NP", name: "Nikita Podryez", role: "Student of NULP CE-403" },
];

export default function AboutPage() {
    const navigate = useNavigate();
    const [sellModalOpen, setSellModalOpen] = useState(false);

    return (
        <>
            <Navbar onOpenSellModal={() => setSellModalOpen(true)} />

            <SellCarModal
                isOpen={sellModalOpen}
                onClose={() => setSellModalOpen(false)}
                onCreated={() => setSellModalOpen(false)}
            />

            <div className="about-page">

                {/* ── HERO ── */}
                <section className="about-hero">
                    <div className="about-hero-badge">About CTS</div>

                    <h1 className="about-hero-title">
                        The smarter way<br />
                        <span className="about-hero-accent">to buy &amp; sell cars</span>
                    </h1>

                    <p className="about-hero-sub">
                        CTS is a Ukrainian marketplace built on one idea: car transactions
                        should be fast, safe, and human. No middlemen. No nonsense.
                    </p>

                    <div className="about-hero-actions">
                        <button
                            className="about-btn-primary"
                            onClick={() => navigate("/browse")}
                        >
                            Browse Cars
                        </button>
                        <button
                            className="about-btn-ghost"
                            onClick={() => setSellModalOpen(true)}
                        >
                            Sell Your Car
                        </button>
                    </div>

                    {/* decorative rings */}
                    <div className="about-hero-ring about-hero-ring--1" />
                    <div className="about-hero-ring about-hero-ring--2" />
                    <div className="about-hero-ring about-hero-ring--3" />
                </section>

                {/* ── STATS ── */}
                <section className="about-stats">
                    {STATS.map(s => (
                        <div key={s.label} className="about-stat-card">
                            <div className="about-stat-value">{s.value}</div>
                            <div className="about-stat-label">{s.label}</div>
                        </div>
                    ))}
                </section>

                {/* ── MISSION ── */}
                <section className="about-mission">
                    <div className="about-mission-left">
                        <div className="about-section-eyebrow">Our Mission</div>
                        <h2 className="about-section-title">
                            We exist to remove friction from car ownership
                        </h2>
                    </div>
                    <div className="about-mission-right">
                        <p>
                            Car buying in Ukraine has always been complicated — opaque
                            pricing, unreliable sellers, time-consuming dealership visits.
                            We set out to fix that by building a platform where anyone can
                            list or find a vehicle with confidence.
                        </p>
                        <p>
                            CTS launched in 2023 with a simple promise: show real cars,
                            at real prices, sold by real people. Today we're trusted by
                            thousands of buyers and sellers across the country.
                        </p>
                        <div className="about-mission-divider" />
                        <div className="about-mission-quote">
                            "We believe the best car deal is the one you can trust from
                            the first click."
                            <span className="about-mission-quote-author">— CTS Team</span>
                        </div>
                    </div>
                </section>

                {/* ── VALUES ── */}
                <section className="about-values">
                    <div className="about-section-eyebrow">What We Stand For</div>
                    <h2 className="about-section-title about-section-title--center">
                        Our core values
                    </h2>
                    <div className="about-values-grid">
                        {VALUES.map(v => (
                            <div key={v.title} className="about-value-card">
                                <div className="about-value-icon">{v.icon}</div>
                                <div className="about-value-title">{v.title}</div>
                                <div className="about-value-desc">{v.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── TEAM ── */}
                <section className="about-team">
                    <div className="about-section-eyebrow">The People</div>
                    <h2 className="about-section-title about-section-title--center">
                        Meet the Developer
                    </h2>
                    <div className="about-team-grid">
                        {TEAM.map(p => (
                            <div key={p.name} className="about-team-card">
                                <div className="about-team-avatar">{p.initials}</div>
                                <div className="about-team-name">{p.name}</div>
                                <div className="about-team-role">{p.role}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="about-cta">
                    <h2 className="about-cta-title">
                        Ready to find your next car?
                    </h2>
                    <p className="about-cta-sub">
                        Thousands of verified listings are waiting for you.
                    </p>
                    <button
                        className="about-btn-primary about-btn-primary--lg"
                        onClick={() => navigate("/browse")}
                    >
                        Start Browsing →
                    </button>
                </section>

            </div>
        </>
    );
}