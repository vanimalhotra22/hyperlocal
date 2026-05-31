import express from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  getAllBookings,
  getUserBookings,
  getProviderBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

const router = express.Router();

// View all bookings - by admin
router.get("/", isAuthenticated, authorizeRole("admin"), getAllBookings);

// Get all bookings for logged in user
router.get("/user", isAuthenticated, authorizeRole("user"), getUserBookings);

// Get all bookings assigned to provider
router.get("/provider", isAuthenticated, authorizeRole("provider"), getProviderBookings);

// Create a booking - by user
router.post("/", isAuthenticated, authorizeRole("user"), createBooking);

// Get booking by ID
router.get("/:id", isAuthenticated, getBookingById);

// Update booking status (accept, cancel, complete)
router.patch("/:id/status", isAuthenticated, updateBookingStatus);

export default router;
