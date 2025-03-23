import { useState, useEffect } from "react";
import { getReviews, addReview, editReview, deleteReview } from "../../services/reviewService";
import './Review.css';

const ReviewSection = ({ productId, userId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await getReviews(productId);
                setReviews(data);
            } catch (err) {
                setError("Error fetching reviews.");
            }
        };
        loadReviews();
    }, [productId]);

    const handleAddReview = async () => {
        try {
            const newReview = await addReview(productId, rating, comment);
            setReviews([...reviews, newReview]);
            setComment("");
        } catch (err) {
            setError("Error adding review.");
        }
    };

    const handleEditReview = async (reviewId) => {
        try {
            const updatedReview = await editReview(reviewId, rating, comment);
            setReviews(reviews.map((r) => (r._id === reviewId ? updatedReview : r)));
            setEditingReview(null);
            setComment("");
        } catch (err) {
            setError("Error updating review.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter((r) => r._id !== reviewId));
        } catch (err) {
            setError("Error deleting review.");
        }
    };

    return (
        <div className="review-section">
            <h3>Customer Reviews</h3>
            {error && <p className="error">{error}</p>}

            {reviews.length === 0 ? <p>No reviews yet.</p> : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id}>
                            <p><strong>{review.user.name}</strong>: {review.comment}</p>
                            <p>Rating: {review.rating} / 5</p>
                            {userId === review.user._id && (
                                <div>
                                    <button onClick={() => { setEditingReview(review._id); setComment(review.comment); }}>Edit</button>
                                    <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <div className="review-form">
                <h4>{editingReview ? "Edit Review" : "Add a Review"}</h4>
                <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a review"></textarea>
                <button onClick={editingReview ? () => handleEditReview(editingReview) : handleAddReview}>
                    {editingReview ? "Update Review" : "Submit Review"}
                </button>
            </div>
        </div>
    );
};

export default ReviewSection;
