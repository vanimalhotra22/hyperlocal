import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createReview, getReviewByBookingId, getMyReviews, getReviewsOfUser, getAllGivenReviews, getAllReceivedReviews } from "../controllers/review.controller.js";

const router = express.Router();

// Create new review
router.post("/", isAuthenticated, createReview);

// Get review for specific booking
router.get("/booking/:id", isAuthenticated, getReviewByBookingId);

// Get all review for logged in user or provider (given and received)
router.get("/my-reviews", isAuthenticated, getMyReviews);

// Get all reviews for specific user or provider (given and received)
router.get("/all-reviews/:userId", isAuthenticated, getReviewsOfUser);

// Get all reviwes given by user or provider
router.get("/reviews-given", isAuthenticated, getAllGivenReviews);

// Get all reviews got for user or provider
router.get("/reviews-received", isAuthenticated, getAllReceivedReviews);

export default router;
