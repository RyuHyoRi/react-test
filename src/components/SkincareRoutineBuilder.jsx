import { useState } from 'react';

function SkincareRoutineBuilder() {
  const [selectedConcern, setSelectedConcern] = useState("all");
  const [selectedStep, setSelectedStep] = useState("all");
  const [routine, setRoutine] = useState([]);
  
  const products = [
    { id: 1, name: "Low pH Cleanser", brand: "COSRX", step: 1, stepName: "Cleanse", concerns: ["acne", "oily"], price: 12 },
    { id: 2, name: "AHA/BHA Toner", brand: "COSRX", step: 2, stepName: "Tone", concerns: ["acne", "texture"], price: 22 },
    { id: 3, name: "Snail Mucin Essence", brand: "COSRX", step: 3, stepName: "Essence", concerns: ["hydration", "anti-aging"], price: 25 },
    { id: 4, name: "Glow Serum", brand: "Beauty of Joseon", step: 4, stepName: "Serum", concerns: ["brightening", "hydration"], price: 17 },
    { id: 5, name: "Centella Cream", brand: "SKIN1004", step: 5, stepName: "Moisturize", concerns: ["sensitive", "redness"], price: 24 },
    { id: 6, name: "Daily Sunscreen", brand: "Beauty of Joseon", step: 6, stepName: "Protect", concerns: ["all"], price: 16 },
  ];
  
  const concerns = ["all", "acne", "oily", "hydration", "anti-aging", "brightening", "sensitive"];
  const steps = [
    { value: "all", label: "All Steps" },
    { value: 1, label: "Step 1: Cleanse" },
    { value: 2, label: "Step 2: Tone" },
    { value: 3, label: "Step 3: Essence" },
    { value: 4, label: "Step 4: Serum" },
    { value: 5, label: "Step 5: Moisturize" },
    { value: 6, label: "Step 6: Protect" },
  ];
  
  const filteredProducts = products.filter(product => {
    const matchesConcern = selectedConcern === "all" || 
      product.concerns.includes(selectedConcern) || 
      product.concerns.includes("all");
    const matchesStep = selectedStep === "all" || product.step === selectedStep;
    return matchesConcern && matchesStep;
  });
  
  const addToRoutine = (product) => {
    // 같은 스텝의 제품이 있으면 교체
    const existingIndex = routine.findIndex(p => p.step === product.step);
    if (existingIndex >= 0) {
      setRoutine(routine.map((p, i) => i === existingIndex ? product : p));
    } else {
      setRoutine([...routine, product].sort((a, b) => a.step - b.step));
    }
  };
  
  const removeFromRoutine = (productId) => {
    setRoutine(routine.filter(p => p.id !== productId));
  };
  
  const getTotalPrice = () => routine.reduce((sum, p) => sum + p.price, 0);
  
  return (
    <div className="routine-builder">
      <header>
        <h1>Build Your K-Beauty Routine</h1>
        <p>Select products for each step based on your skin concerns</p>
      </header>
      
      <div className="filters">
        <div className="filter-group">
          <label>Skin Concern:</label>
          <select value={selectedConcern} onChange={e => setSelectedConcern(e.target.value)}>
            {concerns.map(concern => (
              <option key={concern} value={concern}>
                {concern === "all" ? "All Concerns" : concern.charAt(0).toUpperCase() + concern.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Routine Step:</label>
          <select value={selectedStep} onChange={e => setSelectedStep(e.target.value === "all" ? "all" : Number(e.target.value))}>
            {steps.map(step => (
              <option key={step.value} value={step.value}>{step.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="builder-layout">
        <section className="product-selection">
          <h2>Available Products ({filteredProducts.length})</h2>
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products match your filters</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-option">
                  <span className="step-badge">Step {product.step}</span>
                  <h3>{product.name}</h3>
                  <p className="brand">{product.brand}</p>
                  <p className="price">${product.price}</p>
                  <button 
                    onClick={() => addToRoutine(product)}
                    disabled={routine.some(p => p.id === product.id)}
                  >
                    {routine.some(p => p.id === product.id) ? "Added ✓" : "Add to Routine"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <aside className="my-routine">
          <h2>My Routine</h2>
          {routine.length === 0 ? (
            <p className="empty-routine">Start adding products to build your routine!</p>
          ) : (
            <>
              <ol className="routine-steps">
                {routine.map(product => (
                  <li key={product.id}>
                    <span className="step-name">{product.stepName}</span>
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">${product.price}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromRoutine(product.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
              <div className="routine-summary">
                <p>Total: ${getTotalPrice()}</p>
                <button className="add-all-btn">Add All to Cart</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default SkincareRoutineBuilder;