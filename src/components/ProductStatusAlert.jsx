function ProductStatusAlert({
    type,
    title,
    children,
    dismissible = true,
    countryCode,
    expiresAt,
    stockCount
}) {
    const getAlertStyle = () => {
        switch (type) {
            case "sale":
                return { 
                    backgroundColor: "#ee5454",
                    message: "Flash Sale! 30% OFF - Ends in 2h 30m",
                    icon: "🔥"
                };
            case "low-stock":
                return { 
                    backgroundColor: "#eed254",
                    message: `Hurry! Only ${stockCount} left in stock`,
                    icon: "⚠️"
                };
            case "out-of-stock":
                return { 
                    backgroundColor: "#b0b0b0",
                    message: "Sold Out - Enter email for restock notification",
                    icon: "❌"
                };
            case "preorder":
                return { 
                    backgroundColor: "#668ad8",
                    message: `Pre-order now! Ships on ${expiresAt ? expiresAt.toLocaleDateString() : 'TBA'}`,
                    icon: "📦"
                };
            case "new":
                return { 
                    backgroundColor: "#54ee7f",
                    message: "New Arrival - Just landed this week",
                    icon: "✨"
                };
            case "bestseller":
                return { 
                    backgroundColor: "#e2c72d",
                    message: "#1 Best Seller in Essences",
                    icon: "🏆"
                };
            case "shipping-restricted":
                return {
                    backgroundColor: "#ad3b3b",
                    message: `This item cannot be shipped to ${countryCode}`,
                    icon: "🚫"
                };
            default:
                return {};
        }
    };
    
    return (
        <>
            <div className="product-status-alert" style={{ backgroundColor: getAlertStyle().backgroundColor }}>
                <strong className="alert-title">{title}</strong>
                <div className="alert-content">{children}</div>
                {getAlertStyle().icon} {getAlertStyle().message}
                {dismissible === true && (
                    <button className="alert-dismiss" aria-label="Dismiss Alert">
                        ×
                    </button>
                )}
            </div>
        </>
    );
}

export default ProductStatusAlert;