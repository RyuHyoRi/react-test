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
                    className='product-action-button'
                    onClick={onClick}
                    >
                    Add to Cart
                    </button>
                    <label className="stock-status">
                    {stockStatus === "low-stock" && `Only ${stockCount} left!`}
                    </label>
                </div>
            ) : variant === "buy-now" ? (
                <div className="product-action-button-container">
                    <button
                    className='product-action-button buy-now'
                    disabled
                    >
                        Notify Me
                    </button>
                </div>
            ) : null}
        </>
    );
}

export default ProductActionButton;