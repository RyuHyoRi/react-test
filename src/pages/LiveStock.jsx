import { useState, useEffect } from 'react';
import LiveStockIndicator from '../components/LiveStockIndicator';
import './LiveStock.css';

function LiveStock() {
    const [stock, setStock] = useState(15);

    function randomDelta() {
    const n = Math.floor(Math.random() * 3) + 1;
    return Math.random() < 0.5 ? -n : n;
    }

    return (
        <div>
            <LiveStockIndicator productId="CX-SNL-100" stock={stock} onStockChange={randomDelta} setStock={setStock} />
        </div>
    );
}

export default LiveStock;