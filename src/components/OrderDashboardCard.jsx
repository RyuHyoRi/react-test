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
            default:
                return "";
        }
    }

    const getTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }

    return (
        <div className="order-dashboard-card">
            <div className="order-dashboard-card-header">
                <span>{order.id}</span>
                <span>{getIcon(order.status)} {order.status}</span>
            </div>
            <div className="card-info">
                <span>{order.date}</span>
                <span>${getTotalPrice(order.items)}</span>
            </div>
            <div className="card-details-tab">
                <div>
                    <span>▼</span>
                    <span>View Details</span>
                </div>
            </div>
            <div className="order-dashboard-card-body">
                <p>{order.items.map(item => item.name).join(", ")}</p>
                <p>{order.status}</p>
                <p>{order.shippingAddress}</p>
                <p>{order.trackingNumber}</p>
            </div>
        </div>
    );
}

export default OrderDashboardCard;