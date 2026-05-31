import mongoose from "mongoose";

/* Defines a service type available on the platform */
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, maxLength: 5000 },
    category: { type: String, required: true, lowercase: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    icon: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
