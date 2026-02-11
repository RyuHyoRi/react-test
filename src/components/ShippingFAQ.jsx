import React, { useMemo, useRef, useState } from "react";

const countryLabels = {
    ALL: "🌍 All Countries",
    US: "🇺🇸 United States",
    CA: "🇨🇦 Canada",
    GB: "🇬🇧 United Kingdom",
    AU: "🇦🇺 Australia",
    DE: "🇩🇪 Germany",
    FR: "🇫🇷 France",
    JP: "🇯🇵 Japan",
    KR: "🇰🇷 South Korea",
};

const categories = [
    { key: "shipping", label: "Shipping" },
    { key: "customs", label: "Customs & Duties" },
    { key: "returns", label: "Returns" },
    { key: "tracking", label: "Tracking" },
];

const faqData = [
    {
        id: 1,
        category: "shipping",
        question: "How long does international shipping take?",
        answer:
            "Standard shipping typically takes 7–14 business days. Express options may be available at checkout depending on your location.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
        countrySpecific: {
            US: "US: Standard 7–14 business days. Express 3–5 business days (extra fee).",
            AU: "AU: Remote areas may take an additional 2–4 business days.",
            KR: "KR: Domestic handoff may add 1 business day for final-mile delivery.",
        },
        relatedLinks: [{ label: "Track your order", url: "/orders" }],
    },
    {
        id: 2,
        category: "shipping",
        question: "What are the shipping costs?",
        answer:
            "Shipping costs are calculated at checkout based on destination, weight, and selected service level.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
        countrySpecific: {
            DE: "DE: VAT may be collected at checkout depending on the product category.",
        },
    },
    {
        id: 3,
        category: "shipping",
        question: "Do you ship to my country?",
        answer:
            "We ship to many countries. Select your country from the dropdown to see available FAQs and policies for your location.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
    },
    {
        id: 4,
        category: "customs",
        question: "Will I have to pay customs duties?",
        answer:
            "Customs duties vary by country and order value. Some destinations may require additional taxes or fees upon delivery.",
        countries: ["GB", "DE", "FR", "AU", "JP", "KR"],
        countrySpecific: {
            AU: "AU: Orders over AUD 1,000 may be subject to GST and duties.",
            GB: "GB: VAT may be included at checkout for eligible items.",
            KR: "KR: Personal customs clearance code (PCCC) may be required at delivery.",
        },
    },
    {
        id: 5,
        category: "customs",
        question: "Why is my order held at customs?",
        answer:
            "Your shipment may be held due to missing information, inspections, or unpaid duties. Contact your local customs office or carrier for details.",
        countries: ["GB", "DE", "FR", "AU", "JP", "KR"],
    },
    {
        id: 6,
        category: "returns",
        question: "Can I return an international order?",
        answer:
            "Returns are accepted within the return window if items are unused and in original packaging. Some items may be non-returnable due to hygiene regulations.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
    },
    {
        id: 7,
        category: "returns",
        question: "How long do refunds take?",
        answer:
            "Refunds are typically processed within 5–10 business days after the return is received and inspected. Bank processing times may vary.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
    },
    {
        id: 8,
        category: "tracking",
        question: "Where can I track my package?",
        answer:
            "You can track your order using the tracking link provided in your shipping confirmation email or on the tracking page.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
        relatedLinks: [{ label: "Tracking page", url: "/orders" }],
    },
    {
        id: 9,
        category: "tracking",
        question: "My tracking hasn't updated. What should I do?",
        answer:
            "Tracking updates can pause during handoffs between carriers or customs. If there is no update for 5 business days, please contact support.",
        countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP", "KR"],
    },
];

// 검색 정규식
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 검색 필터링
function includesQuery(item, query, selectedCountry) {
    if (!query) return true;

    const q = query.toLowerCase();
    const question = (item.question || "").toLowerCase();
    const answer = (item.answer || "").toLowerCase();
    const cs = (item.countrySpecific?.[selectedCountry] || "").toLowerCase();

    return question.includes(q) || answer.includes(q) || cs.includes(q);
}

// 검색어 하이라이트
function highlightText(text, query) {
    if (!query) return text;

    const safe = escapeRegExp(query);
    const re = new RegExp(`(${safe})`, "ig");
    const parts = String(text).split(re);

    return parts.map((part, idx) => {
        if (part.toLowerCase() === query.toLowerCase()) {
            return (
                <mark key={idx} className="sagi-mero">
                    {part}
                </mark>
            );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
}

// ShippingFAQ 컴포넌트
const ShippingFAQ = () => {
    const [selectedCountry, setSelectedCountry] = useState("ALL");
    const [activeCategory, setActiveCategory] = useState("shipping");
    const [query, setQuery] = useState("");
    const [feedback, setFeedback] = useState(() => ({}));

    const itemRefs = useRef(new Map());

    // 사용 가능한 국가 목록
    const availableCountries = useMemo(() => {
        const set = new Set();
        faqData.forEach((f) => (f.countries || []).forEach((c) => set.add(c)));

        const list = Array.from(set);
        list.sort((a, b) => (countryLabels[a] || a).localeCompare(countryLabels[b] || b));

        return ["ALL", ...list];
    }, []);

    // 필터링된 FAQ 목록
    const filtered = useMemo(() => {
        return faqData
            .filter((f) => f.category === activeCategory)
            .filter((f) => (selectedCountry === "ALL" ? true : (f.countries || []).includes(selectedCountry)))
            .filter((f) => includesQuery(f, query, selectedCountry));
    }, [activeCategory, selectedCountry, query]);

    // 관련 FAQ 목록
    const relatedById = useMemo(() => {
        const map = new Map();

        faqData.forEach((item) => {
            const rel = faqData
                .filter((x) => x.category === item.category && x.id !== item.id)
                .filter((x) => (selectedCountry === "ALL" ? true : (x.countries || []).includes(selectedCountry)))
                .slice(0, 3);

            map.set(item.id, rel);
        });

        return map;
    }, [selectedCountry]);

    // 도움이 되는 피드백 클릭
    const setHelpful = (id, value) => {
        setFeedback((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // FAQ 열기/스크롤
    const openAndScrollTo = (id) => {
        const el = itemRefs.current.get(id);
        if (!el) return;

        el.open = true;

        requestAnimationFrame(() => {
            el.scrollIntoView?.({ behavior: "smooth", block: "start" });
        });
    };

    return (
        <section className="faq-shell">
            <div className="livo-karo">
                <header className="muto-sari">
                    <div className="neso-rina">
                        <div className="peko-lamo" aria-hidden="true">
                            📦
                        </div>
                        <div>
                            <h2 className="zuri-nexo">Shipping & Delivery FAQ</h2>
                            <p className="fira-luno">
                                Country-specific shipping, customs, returns, and tracking information.
                            </p>
                        </div>
                    </div>

                    <div className="gavo-tira">
                        <label className="suto-mare">
                            <span className="lume-kada">🌍 Select your country</span>
                            <select
                                className="boro-nemi"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                                {availableCountries.map((code) => (
                                    <option key={code} value={code}>
                                        {countryLabels[code] || `🌍 ${code}`}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="suto-mare kira-suto">
                            <span className="lume-kada">🔍 Search</span>
                            <input
                                className="nami-boro"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search FAQs..."
                            />
                        </label>
                    </div>
                </header>

                <nav className="veko-sapa" aria-label="FAQ categories">
                    {categories.map((c) => {
                        const isActive = activeCategory === c.key;

                        return (
                            <button
                                key={c.key}
                                type="button"
                                className={`sapa-veko ${isActive ? "veko-kita" : ""}`}
                                onClick={() => setActiveCategory(c.key)}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {c.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="rali-ponu">
                    {filtered.length === 0 ? (
                        <div className="vuno-pali">
                            <div className="pali-vuno">No FAQs found</div>
                            <div className="vuno-sari">Try changing the country or adjusting your search keyword.</div>
                        </div>
                    ) : (
                        <ul className="ponu-rali">
                            {filtered.map((item) => {
                                const countryNote =
                                    selectedCountry !== "ALL" ? item.countrySpecific?.[selectedCountry] : null;
                                const related = relatedById.get(item.id) || [];

                                return (
                                    <li key={item.id}>
                                        <details
                                            className="kedo-suni"
                                            ref={(el) => el && itemRefs.current.set(item.id, el)}
                                        >
                                            <summary className="rimo-keda">
                                                <span className="keda-rimo keda-closed" aria-hidden="true">
                                                    ▶
                                                </span>
                                                <span className="keda-rimo keda-open" aria-hidden="true">
                                                    ▼
                                                </span>
                                                <span className="foka-siru">{highlightText(item.question, query)}</span>
                                            </summary>

                                            <div className="nopi-lare">
                                                <div className="lare-nopi">
                                                    <p className="pami-sote">{highlightText(item.answer, query)}</p>

                                                    {countryNote ? (
                                                        <div className="vati-nuku">
                                                            <div className="nuku-vati">
                                                                {countryLabels[selectedCountry] || selectedCountry}
                                                            </div>
                                                            <div className="vati-kune">
                                                                {highlightText(countryNote, query)}
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    {Array.isArray(item.relatedLinks) && item.relatedLinks.length > 0 ? (
                                                        <div className="devo-rako">
                                                            {item.relatedLinks.map((l, idx) => (
                                                                <a key={idx} className="rako-devo" href={l.url}>
                                                                    → {l.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : null}

                                                    <div className="huro-mena">
                                                        <span className="mena-huro">Was this helpful?</span>
                                                        <button
                                                            type="button"
                                                            className={`yaso-tigi ${
                                                                feedback[item.id] === "yes" ? "tigi-yaso" : ""
                                                            }`}
                                                            onClick={() => setHelpful(item.id, "yes")}
                                                        >
                                                            👍 Yes
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`yaso-tigi ${
                                                                feedback[item.id] === "no" ? "tigi-yaso" : ""
                                                            }`}
                                                            onClick={() => setHelpful(item.id, "no")}
                                                        >
                                                            👎 No
                                                        </button>
                                                    </div>

                                                    {related.length > 0 ? (
                                                        <div className="roki-sena">
                                                            <div className="sena-roki">Related FAQs</div>
                                                            <ul className="kuvo-rilo">
                                                                {related.map((r) => (
                                                                    <li key={r.id}>
                                                                        <button
                                                                            type="button"
                                                                            className="bixa-nori"
                                                                            onClick={() => openAndScrollTo(r.id)}
                                                                        >
                                                                            {r.question}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </details>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ShippingFAQ;
