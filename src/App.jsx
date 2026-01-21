import { useState } from 'react'
import './App.css'
import ProductPreviewCard from './components/ProductPreviewCard.jsx'
import GlobalShippingCard from './components/GlobalShippingCard.jsx'
import SkincareRoutine from './components/SkincareRoutine.jsx'
import ProductActionButton from './components/ProductActionButton.jsx'

function App() {
  const handleAddToCart = () => {
    alert("Product added to cart!");
  };

  return (
    <>
      <ProductPreviewCard />
      <GlobalShippingCard />
      <SkincareRoutine />
    </>
  )
}

export default App
