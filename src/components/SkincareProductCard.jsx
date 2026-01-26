import ProductActionButton from "./ProductActionButton";
import ProductStatusAlert from "./ProductStatusAlert";

function SkincareProductCard({ 
    brand,
    name, 
    price, 
    imageUrl, 
    step,           // 루틴 단계: 1(토너), 2(에센스), 3(세럼), 4(크림)
    skinTypes,      // 적합한 피부 타입들
    volume,
    discount = 0,
    inStock = true,
    onAddToCart,
    variant = "cart",
    size = "medium",
    stockCount,
    stockStatus,
    isWishlisted,
    type,
    dismissible,
    countryCode,
    expiresAt
}) {
  const stepLabels = {
    1: { name: "Toner", icon: "💧" },
    2: { name: "Essence", icon: "✨" },
    3: { name: "Serum", icon: "💎" },
    4: { name: "Moisturizer", icon: "🧴" },
    5: { name: "Sunscreen", icon: "☀️" },
  };
  
  const finalPrice = price * (1 - discount / 100);
  const stepInfo = stepLabels[step] || { name: "Other", icon: "📦" };
  
  return (
    <>
    <div className={`skincare-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="step-badge">
        <span className="step-icon">{stepInfo.icon}</span>
        <span className="step-name">Step {step}: {stepInfo.name}</span>
      </div>
      
      <img src={imageUrl} alt={name} />
      
      <div className="product-info">
        <span className="brand">{brand}</span>
        <h3 className="name">{name}</h3>
        <span className="volume">{volume}</span>
        
        <div className="skin-types">
          {skinTypes.map(type => (
            <span key={type} className="skin-type-tag">{type}</span>
          ))}
        </div>
        
        <div className="price-section">
          {discount > 0 && (
            <>
              <span className="original-price">${price.toFixed(2)}</span>
              <span className="discount-badge">-{discount}%</span>
            </>
          )}
          <span className="final-price">${finalPrice.toFixed(2)}</span>
        </div>
        
        <ProductActionButton
          variant={variant}
          size={size}
          stockStatus={stockStatus}
          onClick={() => onAddToCart({ brand, name, price: finalPrice })}
          stockCount={stockCount}
        />
        <ProductActionButton
            variant="wishlist"
            isWishlisted={isWishlisted}
            onClick={() => alert(`Added ${brand} - ${name} to wishlist!`)}
        />
      </div>
      <ProductStatusAlert
        type={type}
        dismissible={dismissible}
        stockCount={stockCount}
        countryCode={countryCode}
        expiresAt={expiresAt}
      >
      </ProductStatusAlert>
    </div>
    </>
  );
}

export default SkincareProductCard;