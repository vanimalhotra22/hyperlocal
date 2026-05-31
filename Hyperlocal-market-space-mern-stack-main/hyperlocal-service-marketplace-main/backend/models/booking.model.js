import mongoose from "mongoose";

/* Stores individual service bookings */
const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Customer who booked
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Provider assigned
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true }, // Service selected
    status: { type: String, enum: ["awaiting_provider", "scheduled", "in_progress", "completed", "cancelled", "unassigned"], default: "awaiting_provider", index: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending", index: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [lng, lat] format
      },
    },
    amount: { type: Number, required: true, min: 0 },
    notes: { type: String, max: 1000 },
    scheduledTime: { type: Date, required: true }, // When the service is scheduled
    workStartTime: { type: Date },
    workEndTime: { type: Date },
    providerResponseDeadline: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
    providerAssignmentAttempts: { type: Number, default: 1 },
    maxAttempts: { type: Number, default: 3 },
  },
  { timestamps: true }
);

// Enables geospatial queries on location
bookingSchema.index({ "address.location": "2dsphere" });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
