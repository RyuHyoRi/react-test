import OrderDashboardCard from "../components/OrderDashboardCard";

function OrderDashboard() {
    const initialOrders = [
        {
            id: "ORD-2024-001",
            date: "2024-01-15",
            items: [
            { name: "COSRX Snail Mucin", quantity: 2, price: 25.00 },
            { name: "Beauty of Joseon Glow Serum", quantity: 1, price: 17.00 }
            ],
            status: "delivered",
            shippingAddress: "123 Main St, New York, NY 10001",
            trackingNumber: "1Z999AA10123456784"
        },
        {
            id: "ORD-2024-002",
            date: "2024-01-18",
            items: [
            { name: "SKIN1004 Centella Ampoule", quantity: 1, price: 22.00 }
            ],
            status: "shipped",
            shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
            trackingNumber: "1Z999AA10123456785"
        },
    ];

    return (
        <>
            <h1>📦 My Orders</h1>
            {initialOrders.map(order => (
                <OrderDashboardCard key={order.id} order={order} />
            ))}
        </>
    );
}

export default OrderDashboard;