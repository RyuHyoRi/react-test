import OrderDashboardCard from "../components/OrderDashboardCard";
import './OrderDashboard.css';
import { useMemo, useState } from 'react';

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
        {
            id: "ORD-2024-003",
            date: "2024-01-20",
            items: [
            { name: "Beauty of Joseon Glow Serum", quantity: 1, price: 17.00 },
            { name: "COSRX Snail Mucin", quantity: 2, price: 25.00 },
            { name: "SKIN1004 Centella Ampoule", quantity: 1, price: 22.00 }
            ],
            status: "cancelled",
            shippingAddress: "789 Pine St, Chicago, IL 60601",
            trackingNumber: "1Z999AA10123456786"
        },
        {
            id: "ORD-2024-004",
            date: "2024-01-22",
            items: [
            { name: "Beauty of Joseon Glow Serum", quantity: 3, price: 17.00 },
            { name: "SKIN1004 Centella Ampoule", quantity: 2, price: 22.00 }
            ],
            status: "processing",
            shippingAddress: "123 Main St, New York, NY 10001",
            trackingNumber: "1Z999AA10123456787"
        },
        {
            id: "ORD-2024-005",
            date: "2024-01-24",
            items: [
            { name: "Beauty of Joseon Glow Serum", quantity: 3, price: 17.00 },
            { name: "COSRX Snail Mucin", quantity: 1, price: 25.00 }
            ],
            status: "pending",
            shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
            trackingNumber: "1Z999AA10123456788"
        }
    ];

    const [orders] = useState(initialOrders);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("newest");

    // 필터 기능
    const handleFilter = (status) => {
        setActiveFilter(status);
    };

    // 검색 기능
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // 정렬 기능
    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    const filteredOrders = useMemo(() => {
        let result = [...orders];

        if (activeFilter !== "all") {
            result = result.filter(order => order.status === activeFilter);
        }

        if (searchTerm.trim()) {
            result = result.filter(order => order.id.includes(searchTerm.trim()) || order.items.some(item => item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())));
        }

        result.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOption === "oldest" ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [orders, activeFilter, searchTerm, sortOption]);

    return (
        <div className="order-dashboard-page">
            <h1>📦 My Orders</h1>
            <ul className="filter-options">
                <li onClick={() => handleFilter("all")} className={activeFilter === "all" ? "active" : ""}>&#91;All({orders.length})&#93;</li>
                <li onClick={() => handleFilter("pending")} className={activeFilter === "pending" ? "active" : ""}>&#91;Pending({orders.filter(order => order.status === "pending").length})&#93;</li>
                <li onClick={() => handleFilter("processing")} className={activeFilter === "processing" ? "active" : ""}>&#91;Processing({orders.filter(order => order.status === "processing").length})&#93;</li>
                <li onClick={() => handleFilter("shipped")} className={activeFilter === "shipped" ? "active" : ""}>&#91;Shipped({orders.filter(order => order.status === "shipped").length})&#93;</li>
                <li onClick={() => handleFilter("delivered")} className={activeFilter === "delivered" ? "active" : ""}>&#91;Delivered({orders.filter(order => order.status === "delivered").length})&#93;</li>
                <li onClick={() => handleFilter("cancelled")} className={activeFilter === "cancelled" ? "active" : ""}>&#91;Cancelled({orders.filter(order => order.status === "cancelled").length})&#93;</li>
            </ul>
            <div className="search-options">
                <input type="text" placeholder="Search orders... " onChange={handleSearch} />
                <select name="sort" id="sort" onChange={handleSort} value={sortOption}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                </select>
            </div>
            <div className="order-dashboard-cards">
                {filteredOrders.map(order => (
                    <OrderDashboardCard key={order.id} order={order} />
                ))}
            </div>
            <div className="order-summary">
                <div className="order-summary-title">── Order Summary ──</div>
                <div className="order-summary-info">
                    <span>Total Orders: {filteredOrders.length} </span> 
                    | 
                    <span> Total Spent: ${filteredOrders.reduce((total, order) => total + order.items.reduce((total, item) => total + item.price * item.quantity, 0), 0).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default OrderDashboard;