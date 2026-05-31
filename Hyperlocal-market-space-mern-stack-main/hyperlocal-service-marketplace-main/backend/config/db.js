import mongoose from "mongoose";
import dns from "dns";

// Connect to MongoDB
const connectDB = async () => {
  try {
    // For Node.js 18+ IPv6 resolution issues on Windows
    if (dns.setDefaultResultOrder) {
      dns.setDefaultResultOrder("ipv4first");
    }
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;
