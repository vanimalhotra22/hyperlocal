import mongoose from "mongoose";

/* Stores additional data for provider accounts */
const providerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    servicesOfferedIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], // What services provider offers
    bio: { type: String, maxLength: 1000 },
    experience: { type: Number, required: true, min: 0 },
    isVerified: { type: Boolean, default: false, index: true }, // For admin-verified providers
    availability: {
      type: [
        {
          day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], required: true },
          fromTime: { type: Number, required: true },
          toTime: { type: Number, required: true },
        },
      ],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one available day is required"],
    },
    serviceAreas: {
      type: [
        {
          label: { type: String },
          location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true },
          },
          radiusMeters: { type: Number, default: 5000, min: 100, max: 20000 },
        },
      ],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one service area is required"],
    },
  },
  { timestamps: true }
);

// Enables searching for providers near a location
providerProfileSchema.index({ "serviceAreas.location": "2dsphere" });

const ProviderProfile = mongoose.model("ProviderProfile", providerProfileSchema);
export default ProviderProfile;
