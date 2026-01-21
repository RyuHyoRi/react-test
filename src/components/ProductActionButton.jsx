function ProductActionButton({
    variant = "cart",
    size = "medium",
    disabled,
    loading,
    stockStatus,
    onClick,
    stockCount
}) {
    const getButtonLabel = () => {
        if (loading) return "Processing...";
        if (variant === "cart") {
            return stockStatus === "out-of-stock" ? "Notify Me" : "Add to Cart";
        } else if (variant === "wishlist") {
            return "Add to Wishlist";
        }
    };

    return (
        <div className="product-action-button-container">
            <button
                className={`product-action-button ${variant} ${size}`}
                disabled={stockStatus === "out-of-stock" || disabled}
                onClick={onClick}
            >
                {getButtonLabel()}
            </button>
            <label className="stock-status">
                {stockStatus === "low-stock" && `Only ${stockCount} left!`}
            </label>
        </div>
    );
}

export default ProductActionButton;