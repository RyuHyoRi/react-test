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
        <>
            <button
                className={`product-action-button ${variant} ${size}`}
                disabled={disabled || loading}
                onClick={onClick}
            >
                {getButtonLabel()}
            </button>
            <label className="stock-status">
                {stockStatus === "in-stock" && "In Stock"}
                {stockStatus === "low-stock" && `Only ${stockCount} left!`}
                {stockStatus === "out-of-stock" && "Out of Stock"}
            </label>
        </>
    );
}

export default ProductActionButton;