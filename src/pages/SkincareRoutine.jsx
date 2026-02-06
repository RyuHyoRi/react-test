import SkincareRoutineBuilder from '../components/SkincareRoutineBuilder';
import ReviewDashboard from '../components/ReviewDashboard';
function SkincareRoutine() {
    const reviews = [
        {
            id: 1,
            rating: 5,
            title: "Holy Grail Product!",
            content: "I've been using this for 3 months and my skin has never looked better. I'm very happy with the results. I'll definitely buy it again. I highly recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Dry",
            ageGroup: "25-34",
            isVerified: true,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        },
        {
            id: 2,
            rating: 4,
            title: "Good Product!",
            content: "I've been using this for 2 months and my skin has improved a lot. I'm very happy with the results. I'll definitely buy it again. I highly recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Oily",
            ageGroup: "25-34",
            isVerified: false,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        },
        {
            id: 3,
            rating: 3,
            title: "Average Product!",
            content: "I've been using this for 1 month and my skin has improved a lot. I'm very happy with the results. I'll definitely buy it again. I highly recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Sensitive",
            ageGroup: "25-34",
            isVerified: true,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        },
        {
            id: 4,
            rating: 2,
            title: "Bad Product!",
            content: "I've been using this for 1 month and my skin has worsened a lot. I'm very disappointed with the results. I won't buy it again. I don't recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Normal",
            ageGroup: "25-34",
            isVerified: true,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        },
        {
            id: 5,
            rating: 1,
            title: "Worst Product!",
            content: "I've been using this for 1 month and my skin has worsened a lot. I'm very disappointed with the results. I won't buy it again. I don't recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Combination",
            ageGroup: "25-34",
            isVerified: true,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        },
        {
            id: 6,
            rating: 5,
            title: "Best Product!",
            content: "I've been using this for 1 month and my skin has improved a lot. I'm very happy with the results. I'll definitely buy it again. I highly recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Combination",
            ageGroup: "25-34",
            isVerified: true,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        },
        {
            id: 7,
            rating: 5,
            title: "Best Product!",
            content: "I've been using this for 1 month and my skin has improved a lot. I'm very happy with the results. I'll definitely buy it again. I highly recommend it to anyone looking for a good product.",
            author: "SkincareLover",
            date: "2024-01-10",
            skinType: "Combination",
            ageGroup: "25-34",
            isVerified: true,
            photos: ["url1.jpg", "url2.jpg"],
            helpfulCount: 42,
            sellerReply: { content: "Thank you so much for your lovely review!", date: "2024-01-11" },
        }
    ];

    return (
        <div>
            <ReviewDashboard reviews={reviews} />
        </div>
    );
}

export default SkincareRoutine;