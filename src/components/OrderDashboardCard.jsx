import { useState } from 'react';

function OrderDashboardCard({ order }) {
    let icon = "";
    const getIcon = (status) => {
        switch (status) {
            case "delivered":
                return "✅";
            case "shipped":
                return "🚚";
            case "pending":
                return "⏳";
            case "cancelled":
                return "❌";
            case "processing":
                return "🔄";
            default:
                return "";
        }
    }

    const getTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }

    // 상세보기 탭
    const [isDetailsTabOpen, setIsDetailsTabOpen] = useState(true);
    const toggleDetailsTab = () => {
        setIsDetailsTabOpen(!isDetailsTabOpen);
    };

    return (
        <div className="order-dashboard-card">
            <div className="order-dashboard-card-header">
                <span>📦 {order.id}</span>
                <span>{getIcon(order.status)} {order.status}</span>
            </div>
            <div className="card-info">
                <span>{order.date}</span>
                <span>${getTotalPrice(order.items)}</span>
            </div>
            <div className="card-details-tab">
                <div onClick={toggleDetailsTab}>
                    <span className="card-details-tab-icon">{isDetailsTabOpen ? "▼" : "▶"}</span>
                    <span className="card-details-tab-text"> View Details</span>
                </div>
                {order.status === "delivered" ? (
                    <button className="card-details-tab-button">
                        Request Refund
                    </button>
                ) : order.status === "pending" || order.status === "processing" ? (
                    <button className="card-details-tab-button">
                        Cancel Order
                    </button>
                ) : null}
            </div>
            {isDetailsTabOpen && (
            <div className="card-details-content">
                <ul className="item-row">
                    {order.items.map(item => (
                        <li className="item-col" key={item.id}>
                            <span className="item-name">{item.name}</span>
                            { item.quantity > 1 ? (
                                <span className="item-quantity">&#40; x{item.quantity}&#41;</span>
                            ) : null}
                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="order-tracking-number">
                    <span>Tracking: {order.trackingNumber}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderDashboardCard;