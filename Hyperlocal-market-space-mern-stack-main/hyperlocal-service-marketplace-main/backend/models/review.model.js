import mongoose from "mongoose";

/* Stores user ↔ provider reviews after booking */
const reviewSchema = new mongoose.Schema(
  {
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, unique: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, max: 10000 },
    reviewedBy: { type: String, enum: ["user", "provider"], required: true },
    reviewedFor: { type: String, enum: ["user", "provider"], required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
