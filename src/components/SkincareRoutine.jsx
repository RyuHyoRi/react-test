import SkincareProductCard from '../components/SkincareProductCard';
import './SkincareRoutine.css';

function SkincareRoutine() {
  const routineProducts = [
    { 
      id: 1,
      brand: "COSRX", 
      name: "AHA/BHA Clarifying Treatment Toner", 
      price: 22.00, 
      step: 1,
      volume: "150ml",
      skinTypes: ["Oily", "Combination"],
      imageUrl: "https://via.placeholder.com/200",
      discount: 15,
      type: "sale",
      dismissible: true,
    },
    { 
      id: 2,
      brand: "COSRX", 
      name: "Advanced Snail 96 Mucin Power Essence", 
      price: 25.00,
      step: 2,
      volume: "100ml",
      skinTypes: ["All Skin Types"],
      imageUrl: "https://via.placeholder.com/200",
      discount: 0,
      variant: "cart",
      size: "medium",
      stockCount: 5,
      stockStatus: "low-stock",
      type: "low-stock",
      dismissible: false,
    },
    { 
      id: 3,
      brand: "Beauty of Joseon", 
      name: "Glow Serum: Propolis + Niacinamide", 
      price: 17.00,
      step: 3,
      volume: "30ml",
      skinTypes: ["Dull", "Dry"],
      imageUrl: "https://via.placeholder.com/200",
      discount: 10,
      variant: "cart",
      size: "small",
      stockStatus: "out-of-stock",
      isWishlisted: true,
      type: "out-of-stock",
      dismissible: true,
    },
    { 
      id: 4,
      brand: "SKIN1004", 
      name: "Madagascar Centella Soothing Cream", 
      price: 24.00,
      step: 4,
      volume: "75ml",
      skinTypes: ["Sensitive", "Acne-Prone"],
      imageUrl: "https://via.placeholder.com/200",
      discount: 0,
      variant: "buy-now",
      size: "large",
      type: "preorder",
      dismissible: true,
      expiresAt: new Date("2024-02-15T00:00:00"),
    },
        { 
      id: 5,
      brand: "Beauty of Joseon", 
      name: "Glow Serum: Propolis + Niacinamide", 
      price: 17.00,
      step: 3,
      volume: "30ml",
      skinTypes: ["Dull", "Dry"],
      imageUrl: "https://via.placeholder.com/200",
      discount: 10,
      variant: "cart",
      isWishlisted: true,
      type: "bestseller",
      dismissible: false,
    },
    { 
      id: 6,
      brand: "SKIN1004", 
      name: "Madagascar Centella Soothing Cream", 
      price: 24.00,
      step: 4,
      volume: "75ml",
      skinTypes: ["Sensitive", "Acne-Prone"],
      imageUrl: "https://via.placeholder.com/200",
      discount: 0,
      variant: "buy-now",
      size: "large",
      type: "shipping-restricted",
      countryCode: "US",
      dismissible: true,
    },
  ];
  
  const handleAddToCart = (product) => {
    alert(`Added ${product.brand} - ${product.name} to cart!`);
  };
  
  const totalOriginalPrice = routineProducts.reduce((sum, p) => sum + p.price, 0);
  const totalDiscountedPrice = routineProducts.reduce(
    (sum, p) => sum + p.price * (1 - p.discount / 100), 
    0
  );
  
  return (
    <div className="skincare-routine">
      <header className="routine-header">
        <h1>Build Your K-Beauty Routine</h1>
        <p>Follow the Korean 4-step skincare routine for glowing skin</p>
      </header>
      
      <div className="routine-grid">
        {routineProducts.map((product) => (
          <SkincareProductCard
            key={product.id}
            brand={product.brand}
            name={product.name}
            price={product.price}
            step={product.step}
            volume={product.volume}
            skinTypes={product.skinTypes}
            imageUrl={product.imageUrl}
            discount={product.discount}
            onAddToCart={handleAddToCart}
            variant={product.variant}
            size={product.size}
            stockCount={product.stockCount}
            stockStatus={product.stockStatus}
            isWishlisted={product.isWishlisted}
            type={product.type}
            dismissible={product.dismissible}
            countryCode={product.countryCode}
            expiresAt={product.expiresAt}
          />
        ))}
      </div>
      
      <div className="routine-summary">
        <h3>Complete Routine Bundle</h3>
        <p className="original-total">${totalOriginalPrice.toFixed(2)}</p>
        <p className="final-total">${totalDiscountedPrice.toFixed(2)}</p>
        <p className="savings">
          You save: ${(totalOriginalPrice - totalDiscountedPrice).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default SkincareRoutine;