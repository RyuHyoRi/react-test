import './ProductPreviewCard.css'

function ProductPreviewCard() {
  const brand = {
    name: "COSRX",
    foundedYear: 2013,
    origin: "Korea",
    logoUrl: "https://via.placeholder.com/80",
    categories: ["Skincare", "Essence", "Cleanser"],
    rating: 4.7,
    totalReviews: 89542,
    isBestSeller: true,
  };
  
  
  return (
    <div className="brand-card">
      <div className="brand-header">
        <div className="brand-logo-section">
          <img src={brand.logoUrl} alt={`${brand.name} logo`} className="brand-logo" />
          <span className="brand-name">{brand.name}</span>
        </div>
        {brand.isBestSeller && <div className="best-seller-badge">🏆 Best Seller</div>}
      </div>
      <p className="brand-origin">
        <span className="since">Since {brand.foundedYear} </span>
        ·
        <span className="origin-flag"> Made in {brand.origin} 🇰🇷</span>
      </p>
      <p className="brand-categories">{brand.categories.join(", ")}</p>
      <div className="brand-rating">
        <span className="rating-score">⭐ {brand.rating}</span>
        <span className="total-reviews">({brand.totalReviews.toLocaleString()} reviews)</span>
      </div>
    </div>
  );
}

export default ProductPreviewCard;