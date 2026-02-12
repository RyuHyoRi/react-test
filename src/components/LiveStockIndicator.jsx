import { useEffect, useRef, useState } from "react";

function LiveStockIndicator({ productId, stock = 0, onStockChange, setStock }) {
    const prevStockRef = useRef(stock);
    const didMountRef = useRef(false);

    const [pulse, setPulse] = useState(false);
    const [showExactStock, setShowExactStock] = useState(true);
    const [justBought, setJustBought] = useState(false);

    // 초기 stock 값 노출 (3초)
    useEffect(() => {
        setShowExactStock(true);
        const t = setTimeout(() => setShowExactStock(false), 3000);
        return () => clearTimeout(t);
    }, [productId]);

    // stock 변동 (5초마다)
    useEffect(() => {
        const id = setInterval(() => {
            const delta = typeof onStockChange === "function" ? onStockChange() : 0;

            setStock((prev) => {
                const next = prev + delta;
                return Math.max(0, next);
            });
        }, 5000);

        return () => clearInterval(id);
    }, [onStockChange, setStock, productId]);

    // stock 변동 시
    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            prevStockRef.current = stock;
            return;
        }

        setPulse(true);
        const pulseTimer = setTimeout(() => setPulse(false), 220);

        const prev = prevStockRef.current;
        if (stock < prev) {
            setJustBought(true);
            const boughtTimer = setTimeout(() => setJustBought(false), 2000);

            prevStockRef.current = stock;

            return () => {
                clearTimeout(pulseTimer);
                clearTimeout(boughtTimer);
            };
        }

        prevStockRef.current = stock;

        return () => clearTimeout(pulseTimer);
    }, [stock]);

    return (
        <div className="live-stock-indicator">
            <h2 className="live-stock-indicator-title">📦 Stock Status (Live)</h2>

            {showExactStock ? (
                <p className="live-stock-exact">Current stock: {stock}</p>
            ) : (
                <>
                    {stock === 0 ? (
                        <div className="live-stock-out-of-stock-container">
                            <p className={`live-stock-out-of-stock ${pulse ? "live-stock-pulse" : ""}`}>
                                ⚫ Out of Stock
                            </p>
                            <button type="button" className="live-stock-notify-me-btn">
                                🔔 Notify me
                            </button>
                        </div>
                    ) : stock > 0 && stock < 10 ? (
                        <p className={`live-stock-only-left ${pulse ? "live-stock-pulse" : ""}`}>
                            🔴 Only {stock} left!
                        </p>
                    ) : stock > 9 && stock < 50 ? (
                        <p className={`live-stock-low-stock ${pulse ? "live-stock-pulse" : ""}`}>
                            🟠 Low Stock
                        </p>
                    ) : stock > 49 ? (
                        <p className={`live-stock-in-stock ${pulse ? "live-stock-pulse" : ""}`}>
                            🟢 In Stock
                        </p>
                    ) : null}
                </>
            )}

            {justBought ? <p className="live-stock-someone-just-bought">⚡ Someone just bought this!</p> : null}

            <button
                type="button"
                disabled={stock === 0}
                className={`live-stock-add-to-cart-btn ${stock === 0 ? "live-stock-add-to-cart-btn-disabled" : ""}`}
            >
                🛒 Add to Cart
            </button>
        </div>
    );
}

export default LiveStockIndicator;
