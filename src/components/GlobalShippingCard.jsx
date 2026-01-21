import './GlobalShippingCard.css'

function GlobalShippingCard() {
    const now = new Date();
    const cutoffHour = 14; // 오후 2시 마감
    const shippingInfo = {
        us : { minDays: 7, maxDays: 10 },
        eu : { minDays: 10, maxDays: 14 },
        jp : { minDays: 3, maxDays: 5 },
        au : { minDays: 7, maxDays: 12 }
    };
    
    // 배송 마감까지 남은 시간 계산
    const getCutoffMessage = () => {
        const currentHour = now.getHours();
        if (currentHour < cutoffHour) {
        const hoursLeft = cutoffHour - currentHour - 1;
        const minutesLeft = 60 - now.getMinutes();
        return `Order within ${hoursLeft}h ${minutesLeft}m for same-day processing`;
        }
        return "Orders will be processed tomorrow";
    };
    
    // // 예상 도착일 계산 (영업일 기준)
    const getEstimatedArrival = (minDays, maxDays) => {
        // 여기에 로직 작성
        // 힌트: toLocaleDateString() 사용
        const currentDate = now.getDate();
        const estimatedMinDate = new Date(now);
        estimatedMinDate.setDate(currentDate + minDays);
        console.log(estimatedMinDate);
        const estimatedMaxDate = new Date(now);
        estimatedMaxDate.setDate(currentDate + maxDays);
        console.log(estimatedMaxDate);
        return `${estimatedMinDate.toLocaleDateString()} - ${estimatedMaxDate.toLocaleDateString()}`;
    };
    return (
        <article className="shipping-card">
            <h2>🚚 Global Shipping Information</h2>
            <div>📍 Seoul, Korea (KST)</div>
            <div>Current Time: {now.toLocaleString()}</div>
            <div>⏰ Order within {getCutoffMessage()} for same-day processing</div>
            <div>📦 Estimated Delivery:</div>
            <ul>
                <li>🇺🇸 USA: {getEstimatedArrival(shippingInfo.us.minDays, shippingInfo.us.maxDays)}</li>
                <li>🇪🇺 Europe: {getEstimatedArrival(shippingInfo.eu.minDays, shippingInfo.eu.maxDays)}</li>
                <li>🇯🇵 Japan: {getEstimatedArrival(shippingInfo.jp.minDays, shippingInfo.jp.maxDays)}</li>
                <li>🇦🇺 Australia: {getEstimatedArrival(shippingInfo.au.minDays, shippingInfo.au.maxDays)}</li>
            </ul>
            <div>✨ Free shipping on orders over $60</div>
        </article>
    );
}

export default GlobalShippingCard;