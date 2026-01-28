import { useState } from 'react';
import AdvancedQuantitySelector from './AdvancedQuantitySelector.jsx';

function KBeautyCart() {
  const [cart, setCart] = useState([]);
  const [selectedSamples, setSelectedSamples] = useState([]);
  
  const products = [
    { 
      id: 1, 
      sku: "CX-SNL-100", 
      brand: "COSRX", 
      name: "Snail Mucin Essence", 
      price: 25.00, 
      stock: 50,
      maxStock: 20,
      options: [
        { type: "size", values: ["50ml", "100ml", "200ml"] },
        { type: "shade", values: ["Original", "Light"] }
      ]
    },
    { 
      id: 2, 
      sku: "BOJ-GLW-30", 
      brand: "Beauty of Joseon", 
      name: "Glow Serum", 
      price: 17.00, 
      stock: 30,
      maxStock: 10,
      options: [
        { type: "size", values: ["100ml", "200ml"] },
        { type: "shade", values: ["glow", "matte"] }
      ]
    },
    { 
      id: 3, 
      sku: "SK4-CEN-75", 
      brand: "SKIN1004", 
      name: "Centella Cream", 
      price: 24.00, 
      stock: 15,
      maxStock: 5,
      options: [
        { type: "size", values: ["75ml", "150ml"] },
        { type: "shade", values: ["soft", "medium", "bold"] }
      ]
    }
  ];
  
  const freeSamples = [
    { id: "s1", name: "Sunscreen Sample (2ml)", minOrderAmount: 30 },
    { id: "s2", name: "Sheet Mask", minOrderAmount: 40 },
    { id: "s3", name: "Lip Balm Mini", minOrderAmount: 60 },
  ];
  
  const FREE_SHIPPING_THRESHOLD = 60;

  const getOptionsKey = (selectedOptions) => {
    const normalized = Object.keys(selectedOptions)
      .sort()
      .reduce((acc, key) => {
        acc[key] = selectedOptions[key];
        return acc;
      }, {});
    return JSON.stringify(normalized);
  };

  const calculateLineTotal = (unitPrice, quantity) => {
    const subtotal = unitPrice * quantity;
    if (quantity >= 10) return subtotal * 0.9;
    if (quantity >= 5) return subtotal * 0.95;
    return subtotal;
  };
  
  // 장바구니에 추가
  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    const optionsKey = getOptionsKey(selectedOptions);
    const existingItem = cart.find(
      item => item.id === product.id && item.optionsKey === optionsKey
    );
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        alert(`Sorry, only ${product.stock} items available`);
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id && item.optionsKey === optionsKey
          ? {
              ...item,
              quantity: item.quantity + quantity,
              lineTotal: calculateLineTotal(item.price, item.quantity + quantity)
            }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity,
          selectedOptions,
          optionsKey,
          lineTotal: calculateLineTotal(product.price, quantity)
        }
      ]);
    }
  };
  
  // 장바구니에서 제거
  const removeFromCart = (productId, optionsKey) => {
    setCart(cart.filter(item => !(item.id === productId && item.optionsKey === optionsKey)));
  };
  
  // 수량 변경
  const updateQuantity = (productId, optionsKey, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity < 1) {
      removeFromCart(productId, optionsKey);
      return;
    }
    
    if (newQuantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available`);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId && item.optionsKey === optionsKey
        ? {
            ...item,
            quantity: newQuantity,
            lineTotal: calculateLineTotal(item.price, newQuantity)
          }
        : item
    ));
  };
  
  // 샘플 선택
  const toggleSample = (sampleId) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(selectedSamples.filter(id => id !== sampleId));
    } else if (selectedSamples.length < 2) {
      setSelectedSamples([...selectedSamples, sampleId]);
    } else {
      alert("You can select up to 2 free samples");
    }
  };
  
  // 계산 함수들
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.lineTotal, 0);
  };
  
  const getShippingCost = () => {
    return getSubtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
  };
  
  const getTotalPrice = () => {
    return getSubtotal() + getShippingCost();
  };
  
  const getAvailableSamples = () => {
    const subtotal = getSubtotal();
    return freeSamples.filter(sample => subtotal >= sample.minOrderAmount);
  };
  
  return (
    <div className="kbeauty-cart">
      <section className="products-section">
        <h2>Shop K-Beauty</h2>
        {products.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <span className="brand">{product.brand}</span>
              <span className="name">{product.name}</span>
              <span className="sku">SKU: {product.sku}</span>
            </div>
            <AdvancedQuantitySelector
              productName={product.name}
              unitPrice={product.price}
              maxStock={product.maxStock}
              options={product.options}
              onAddToCart={({ quantity, selectedOptions }) =>
                addToCart(product, quantity, selectedOptions)
              }
            />
          </div>
        ))}
      </section>
      
      <section className="cart-section">
        <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h2>
        
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Start shopping!</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <div className="item-info">
                    <span className="brand">{item.brand}</span>
                    <span className="name">{item.name}</span>
                  </div>
                  <div className="item-options">
                    {Object.entries(item.selectedOptions).map(([optionType, optionValue]) => (
                      <span key={optionType}>{optionType}: {optionValue}</span>
                    ))}
                  </div>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.optionsKey, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.optionsKey, item.quantity + 1)}>+</button>
                </div>
                <span className="item-total">
                  ${item.lineTotal.toFixed(2)}
                </span>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id, item.optionsKey)}
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* 무료 샘플 선택 */}
            {getAvailableSamples().length > 0 && (
              <div className="samples-section">
                <h4>🎁 Choose Free Samples (up to 2)</h4>
                {getAvailableSamples().map(sample => (
                  <label key={sample.id} className="sample-option">
                    <input
                      type="checkbox"
                      checked={selectedSamples.includes(sample.id)}
                      onChange={() => toggleSample(sample.id)}
                    />
                    {sample.name}
                  </label>
                ))}
              </div>
            )}
            
            {/* 무료 배송 프로그레스 */}
            {getSubtotal() < FREE_SHIPPING_THRESHOLD && (
              <div className="shipping-progress">
                <p>
                  Add ${(FREE_SHIPPING_THRESHOLD - getSubtotal()).toFixed(2)} more for FREE shipping!
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(getSubtotal() / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* 합계 */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {getShippingCost() === 0 
                    ? <span className="free">FREE</span> 
                    : `$${getShippingCost().toFixed(2)}`
                  }
                </span>
              </div>
              <div className="summary-row total">
                <strong>Total:</strong>
                <strong>${getTotalPrice().toFixed(2)}</strong>
              </div>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default KBeautyCart;