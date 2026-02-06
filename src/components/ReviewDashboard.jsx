import React, { useMemo, useState } from "react";
import "./ReviewDashboard.css";


const STAR_FILTERS = ["all", 5, 4, 3, 2, 1];
const SKIN_FILTERS = ["all", "Oily", "Dry", "Combination", "Sensitive", "Normal"];

const SORT_OPTIONS = [
    { value: "helpful", label: "Most Helpful" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "rating_desc", label: "Highest Rating" },
    { value: "rating_asc", label: "Lowest Rating" },
];

function maskAuthor(name) {
    const s = (name ?? "").trim();
    if (!s) return "Anonymous";
    if (s.length <= 2) return s[0] + "*";
    return s.slice(0, 3) + "***";
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(d);
}

function Stars({ rating }) {
    const full = Math.max(0, Math.min(5, Number(rating) || 0));
    return (
        <span className="pr-stars" aria-label={`${full} out of 5 stars`}>
        {"★".repeat(full)}
        <span className="pr-stars-muted">{"★".repeat(5 - full)}</span>
        </span>
    );
}

function truncate(text, limit) {
    const s = text ?? "";
    if (s.length <= limit) return { short: s, needsToggle: false };
    return { short: s.slice(0, limit).trimEnd() + "...", needsToggle: true };
}

export default function ReviewDashboard({ reviews = [] }) {
    const [starFilter, setStarFilter] = useState("all");
    const [skinFilter, setSkinFilter] = useState("all");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [withPhotosOnly, setWithPhotosOnly] = useState(false);
    const [sortOption, setSortOption] = useState("helpful");
    const [helpfulOverrides, setHelpfulOverrides] = useState(() => ({}));
    const [helpfulClicked, setHelpfulClicked] = useState(() => new Set());
    const [expandedIds, setExpandedIds] = useState(() => new Set());

    // 별점 계산
    const stats = useMemo(() => {
        const total = reviews.length;
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;

        for (const r of reviews) {
        const rating = Number(r.rating) || 0;
        if (rating >= 1 && rating <= 5) counts[rating] += 1;
        sum += rating;
        }

        const avg = total ? sum / total : 0;
        const recommendCount = counts[4] + counts[5];
        const recommendPct = total ? Math.round((recommendCount / total) * 100) : 0;

        // 별점 분포
        const dist = [5, 4, 3, 2, 1].map((star) => {
        const count = counts[star];
        const pct = total ? Math.round((count / total) * 100) : 0;
        return { star, count, pct };
        });

        return {
        total,
        avg,
        recommendPct,
        dist,
        };
    }, [reviews]);

    // 필터, 정렬 결과
    const filteredSortedReviews = useMemo(() => {
        let list = [...reviews];

        // 별점 필터
        if (starFilter !== "all") {
        list = list.filter((r) => Number(r.rating) === Number(starFilter));
        }

        // 피부타입 필터
        if (skinFilter !== "all") {
        list = list.filter((r) => r.skinType === skinFilter);
        }

        // 인증된 리뷰 필터
        if (verifiedOnly) {
        list = list.filter((r) => r.isVerified);
        }

        // 사진이 있는 리뷰 필터
        if (withPhotosOnly) {
        list = list.filter((r) => Array.isArray(r.photos) && r.photos.length > 0);
        }

        // 정렬
        const getHelpful = (r) =>
        helpfulOverrides[r.id] ?? Number(r.helpfulCount || 0);

        const byDateAsc = (a, b) => new Date(a.date) - new Date(b.date);
        const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

        const sorters = {
        helpful: (a, b) => getHelpful(b) - getHelpful(a),
        newest: byDateDesc,
        oldest: byDateAsc,
        rating_desc: (a, b) => Number(b.rating) - Number(a.rating),
        rating_asc: (a, b) => Number(a.rating) - Number(b.rating),
        };

        list.sort(sorters[sortOption] || sorters.helpful);
        return list;
    }, [
        reviews,
        starFilter, 
        skinFilter,
        verifiedOnly,
        withPhotosOnly,
        sortOption,
        helpfulOverrides,
    ]);

    // 리뷰 더보기 / 접기
    const onToggleExpanded = (id) => {
        setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
        });
    };

    // 도움이 되는 리뷰 증가
    const onHelpful = (id) => {
        setHelpfulClicked((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        setHelpfulOverrides((prev) => {
            const alreadyClicked = helpfulClicked.has(id);
            if (alreadyClicked) return prev;

            const current = prev[id];
            if (current != null) return { ...prev, [id]: current + 1 };

            const base = reviews.find((r) => r.id === id)?.helpfulCount ?? 0;
            return { ...prev, [id]: Number(base) + 1 };
        });
    };

    return (
        <section className="pr-panel">
        {/* 통계 요약 */}
        <div className="pr-summary">
            <div className="pr-summary-top">
                <div className="pr-avg">
                    <span className="pr-avg-star">★</span>
                    <span className="pr-avg-score">{stats.avg.toFixed(1)}</span>
                    <span className="pr-avg-meta">
                    Average ({stats.total.toLocaleString()} reviews)
                    </span>
                </div>
                <div className="pr-recommend">
                    {stats.recommendPct}% would recommend this product
                </div>
            </div>

            <div className="pr-histogram">
            {stats.dist.map((row) => (
                <div key={row.star} className="pr-hist-row">
                    <div className="pr-hist-label">{row.star}★</div>
                    <div className="pr-hist-bar">
                        <div
                        className="pr-hist-fill"
                        style={{ width: `${row.pct}%` }}
                        />
                    </div>
                    <div className="pr-hist-meta">
                        {row.pct}% ({row.count.toLocaleString()})
                    </div>
                </div>
            ))}
            </div>
        </div>

        <div className="pr-divider" />

        {/* 필터 / 정렬 */}
        <div className="pr-controls">
            <div className="pr-filters">
                <div className="pr-control">
                    <label className="pr-label" htmlFor="starFilter">
                    Stars
                    </label>
                    <select
                    id="starFilter"
                    value={starFilter}
                    onChange={(e) =>
                        setStarFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                    }
                    >
                    <option value="all">All Stars</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                    </select>
                </div>

                <div className="pr-control">
                    <label className="pr-label" htmlFor="skinFilter">
                    Skin Type
                    </label>
                    <select
                    id="skinFilter"
                    value={skinFilter}
                    onChange={(e) => setSkinFilter(e.target.value)}
                    >
                    <option value="all">All Skin</option>
                    {SKIN_FILTERS.filter((s) => s !== "all").map((skin) => (
                        <option key={skin} value={skin}>
                        {skin}
                        </option>
                    ))}
                    </select>
                </div>

                <label className="pr-checkbox">
                    <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    Verified Only
                </label>

                <label className="pr-checkbox">
                    <input
                    type="checkbox"
                    checked={withPhotosOnly}
                    onChange={(e) => setWithPhotosOnly(e.target.checked)}
                    />
                    With Photos
                </label>
            </div>

            <div className="pr-sort">
                <div className="pr-control">
                    <label className="pr-label" htmlFor="sortOption">
                    Sort
                    </label>
                    <select
                    id="sortOption"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                        {opt.label}
                        </option>
                    ))}
                    </select>
                </div>
            </div>
        </div>

        <div className="pr-divider" />
            {/* 리뷰 리스트 */}
            <div className="pr-list">
                {filteredSortedReviews.length === 0 ? (
                <div className="pr-empty">
                    No reviews match your current filters.
                </div>
                ) : (
                filteredSortedReviews.map((r) => {
                    const helpful = helpfulOverrides[r.id] ?? r.helpfulCount ?? 0;
                    const expanded = expandedIds.has(r.id);
                    const { short, needsToggle } = truncate(r.content, 170);

                    return (
                    <article key={r.id} className="pr-card">
                        <header className="pr-card-header">
                        <div className="pr-card-title-row">
                            <Stars rating={r.rating} />
                            <div className="pr-card-title">{r.title}</div>

                            {r.isVerified && (
                            <span className="pr-verified" title="Verified Purchase">
                                Verified
                            </span>
                            )}
                        </div>

                        <div className="pr-card-meta">
                            <span>{maskAuthor(r.author)}</span>
                            <span className="pr-dot">·</span>
                            <span>{formatDate(r.date)}</span>
                        </div>

                        <div className="pr-card-submeta">
                            <span>{r.skinType} Skin</span>
                            <span className="pr-dot">·</span>
                            <span>{r.ageGroup}</span>
                        </div>
                        </header>

                        <div className="pr-card-content">
                        <p className="pr-text">
                            {expanded || !needsToggle ? r.content : short}
                            {needsToggle && (
                            <button
                                type="button"
                                className="pr-readmore"
                                onClick={() => onToggleExpanded(r.id)}
                            >
                                {expanded ? "Read less" : "Read more"}
                            </button>
                            )}
                        </p>

                        {Array.isArray(r.photos) && r.photos.length > 0 && (
                            <div className="pr-photos" aria-label="Review photos">
                            {r.photos.map((url, idx) => (
                                <img
                                key={`${r.id}-photo-${idx}`}
                                className="pr-photo"
                                src={url}
                                alt={`Review photo ${idx + 1}`}
                                loading="lazy"
                                />
                            ))}
                            </div>
                        )}
                        </div>

                        <footer className="pr-card-footer">
                        <button
                            type="button"
                            className="pr-helpful"
                            onClick={() => onHelpful(r.id)}
                            disabled={helpfulClicked.has(r.id)}
                            aria-pressed={helpfulClicked.has(r.id)}
                        >
                            👍 Helpful ({helpful})
                        </button>

                        {r.sellerReply?.content && (
                            <div className="pr-seller-reply">
                            <div className="pr-seller-reply-title">
                                Seller Reply
                                {r.sellerReply?.date ? (
                                <span className="pr-seller-reply-date">
                                    {formatDate(r.sellerReply.date)}
                                </span>
                                ) : null}
                            </div>
                            <div className="pr-seller-reply-body">
                                {r.sellerReply.content}
                            </div>
                            </div>
                        )}
                        </footer>
                    </article>
                    );
                })
                )}
            </div>
        </section>
    );
}
