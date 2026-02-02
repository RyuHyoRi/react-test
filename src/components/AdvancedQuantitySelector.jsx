import { useState, useEffect } from 'react';

function AdvancedQuantitySelector({
    productName,
    unitPrice,
    maxStock,
    options,
    onAddToCart
}) {
    const [quantity, setQuantity] = useState(1);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(unitPrice);
    const [optionsValuesChanged, setOptionsValuesChanged] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});

    // 벌크 구매 할인
    const getDiscountedPrice = (unitPrice, quantity) => {
        if (quantity >= 10) {
            setDiscountPrice(unitPrice * quantity * 0.1);
            setTotalPrice((unitPrice * quantity) - (unitPrice * quantity * 0.1));
            return;
        } else if (quantity >= 5) {
            setDiscountPrice(unitPrice * quantity * 0.05);
            setTotalPrice((unitPrice * quantity) - (unitPrice * quantity * 0.05));
            return;
        } else {
            setTotalPrice(unitPrice * quantity);
            setDiscountPrice(0);
            return;
        }
    };

    // 수량 변경 시 가격 업데이트
    useEffect(() => {
        getDiscountedPrice(unitPrice, quantity);
    }, [unitPrice, quantity]);

    // 상품 옵션 변경 (옵션 별 저장)
    const handleOptionChange = (optionType) => (e) => {
        const { value } = e.target;
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [optionType]: value
        }));
        setOptionsValuesChanged(prev => !prev);
    };

    // 초기 옵션 설정
    const getInitialOptions = () => {
        const initialOptions = {};
        options.forEach(option => {
            initialOptions[option.type] = option.values[0];
        });
        return initialOptions;
    };

    useEffect(() => {
        setSelectedOptions(getInitialOptions());
    }, [options]);

    useEffect(() => {
        setQuantity(1);
    }, [optionsValuesChanged]);
    
    return (
        <div>
            <div>{productName}</div>
            {options.map(option => {
                const optionId = `${productName}-${option.type}`.replace(/\s+/g, '-');
                return (
            <div key={option.type}>
                <label htmlFor={optionId}>{option.type} : </label>
                <select
                    id={optionId}
                    value={selectedOptions[option.type] ?? option.values[0]}
                    onChange={handleOptionChange(option.type)}
                >
                    {option.values.map(optionValue =>
                        <option key={optionValue} value={optionValue}>
                            {optionValue}
                        </option>
                    )}
                </select>
            </div>
            )})}
            <div className="quantity-controls">
                <label htmlFor="quantity-input">Quantity: </label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    max={maxStock}
                    value={quantity}
                    onChange={(e) => {
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val)) val = 1;
                        setQuantity(Math.min(Math.max(1, val), maxStock));
                    }}
                />
                <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}>+</button>
            </div>
            <div style={{padding: "5px 0"}}>
                🏷️ Bulk Discount: {quantity >= 10 ? "10%" : quantity >= 5 ? "5%" : "0%"} &#40;OFF {quantity >= 10 ? "10+" : quantity >= 5 ? "5+" : quantity} items&#41;
            </div>
            <div className="total-price">
                <div className="unit-price">
                    <label>Unit Price: </label>
                    <span>${unitPrice.toFixed(2)}</span>
                </div>
                <div className="discounted-price">
                    <label>Discount : </label>
                    <span>-${(discountPrice).toFixed(2)} &#40;{quantity >= 5 ? (quantity >= 10 ? "10%" : "5%") : "0%"}&#41;</span>
                </div>
                <div className="total-price">
                    <label>Total Price: </label>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <button
                onClick={() => {
                    onAddToCart({ quantity, selectedOptions });
                }}
            >
                Add to Cart
            </button>
            <div>⚠️ Only {maxStock} items available</div>
        </div>
    );
}

export default AdvancedQuantitySelector;