import { useState } from 'react';

function ProductWishlistButton({ productId, initialCount = 0 }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(initialCount);
  
  const handleClick = () => {
    if (isWishlisted) {
      setWishlistCount(prev => prev - 1);
    } else {
      setWishlistCount(prev => prev + 1);
    }
    setIsWishlisted(!isWishlisted);
  };
  
  return (
    <div className="wishlist-button-container">
      <button 
        className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
        onClick={handleClick}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <span className="heart-icon">{isWishlisted ? '❤️' : '🤍'}</span>
        <span className="count">{wishlistCount.toLocaleString()}</span>
      </button>
    </div>
  );
}

export default ProductWishlistButton;