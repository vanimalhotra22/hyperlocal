import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import handleError from "../utils/handleError.js";

// Create a new review for completed booking
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;
    if (!bookingId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return handleError(res, "Booking ID and valid rating (1-5) are required", 400);
    }

    // Verify user exists
    const user = await User.findById(req.user._id).lean();
    if (!user) return handleError(res, "User not found", 404);

    // Check booking
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return handleError(res, "Booking not found", 404);
    if (booking.status !== "completed") return handleError(res, "You can only review completed bookings", 400);

    // Only user or provider involved in the booking can give review
    const isUser = req.user.role === "user" && req.user._id.equals(booking.userId);
    const isProvider = req.user.role === "provider" && req.user._id.equals(booking.providerId);
    if (!isUser && !isProvider) {
      return handleError(res, "You are not authorized to review this booking", 403);
    }

    // Prevent duplicate review for same booking by same role
    const existing = await Review.findOne({ bookingId }).lean();
    if (existing && existing.reviewedBy === req.user.role) {
      return handleError(res, "Review already submitted", 409);
    }

    const newReview = await Review.create({
      reviewerId: req.user._id,
      revieweeId: isUser ? booking.providerId : booking.userId,
      bookingId,
      rating,
      review: typeof review === "string" ? review.trim() : "",
      reviewedBy: isUser ? "user" : "provider",
      reviewedFor: isUser ? "provider" : "user",
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to create review");
  }
};

// Get review by booking id
export const getReviewByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const review = await Review.findOne({ bookingId })
      .populate("reviewerId", "name email phone role profilePhoto")
      .populate("revieweeId", "name email phone role profilePhoto")
      .lean();
    if (!review) return handleError(res, "Review not found", 404);

    return res.status(200).json({
      success: true,
      bookingId,
      data: review,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch review");
  }
};

// Get all review for logged in user (given and received)
export const getMyReviews = async (req, res) => {
  try {
    const givenReview = await Review.find({ reviewerId: req.user._id }).populate("reviewerId", "name role email phone profilePhoto").sort({ createdAt: -1 }).lean();
    const receivedReview = await Review.find({ revieweeId: req.user._id }).populate("revieweeId", "name role email phone profilePhoto").sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      userId: req.user._id,
      data: {
        reviewsGiven: givenReview,
        reviewsReceived: receivedReview,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch reviews");
  }
};

// Get all reviews for specific user (given and received)
export const getReviewsOfUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const givenReview = await Review.find({ reviewerId: userId }).populate("reviewerId", "name role profilePhoto phone email").sort({ createdAt: -1 }).lean();
    const receivedReview = await Review.find({ revieweeId: userId }).populate("revieweeId", "name role profilePhoto phone email").sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      userId,
      data: {
        reviewsGiven: givenReview,
        reviewsReceived: receivedReview,
      },
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch reviews");
  }
};

// Get all reviews created (given) by logged in user
export const getAllGivenReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewerId: req.user._id }).populate("reviewerId", "name email phone role profilePhoto").sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch reviews");
  }
};

// Get all reviews received by logged in user
export const getAllReceivedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.user._id }).populate("revieweeId", "name role email phone profilePhoto").sort({ createdAt: -1 }).lean();

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? (reviews.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: parseFloat(averageRating),
      data: reviews,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch reviews");
  }
};
