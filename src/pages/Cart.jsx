import KBeautyCart from "../components/KBeautyCart";
import ProductWishlistButton from "../components/ProductWishlistButton";
import './Cart.css';

function Cart() {
    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>
            <KBeautyCart />
            <ProductWishlistButton productId={123} initialCount={45} />
        </div>
    );
}

export default Cart;