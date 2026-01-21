import GlobalShippingCard from "../components/GlobalShippingCard";
import ProductPreviewCard from "../components/ProductPreviewCard";

function Home() {
    return (
        <div>
            <h1>Welcome to Our Store</h1>
            <ProductPreviewCard />
            <GlobalShippingCard />
        </div>
    );
}

export default Home;