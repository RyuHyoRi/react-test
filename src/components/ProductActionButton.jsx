function ProductActionButton({
    variant = "cart",
    size = "medium",
    disabled,
    loading,
    stockStatus,
    onClick,
    stockCount,
    isWishlisted
}) {
    const getButtonLabel = () => {
        if (loading) return "Processing...";
        if (variant === "cart") {
            return stockStatus === "out-of-stock" ? "Notify Me" : "Add to Cart";
        }
    };

    return (
        <>
            {variant === "wishlist" ? (
                <div className="wishlist-button-container">
                    <button
                    className={`product-action-button wishlist ${size}`}
                    onClick={onClick}
                    >
                    {isWishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
                    </button>
                </div>
            ) : variant === "cart" ? (
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
            ) : null}
        </>
    );
}

export default ProductActionButton;