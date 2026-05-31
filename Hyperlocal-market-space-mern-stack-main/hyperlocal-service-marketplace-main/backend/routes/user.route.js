import express from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  getAllProviders,
  getUserProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  reactivateAccount,
  addDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  verifyProvider,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get all providers
router.get("/all-providers", isAuthenticated, getAllProviders);

// Get specific user or provider profile
router.get("/:id", isAuthenticated, getUserProfile);

// Update profile of user, admin and provider
router.put("/update-profile", isAuthenticated, updateProfile);

// Change own password
router.patch("/change-password", isAuthenticated, changePassword);

// Deactivate user or provider account
router.patch("/deactivate", isAuthenticated, deactivateAccount);

// Reactivate user or provider account
router.patch("/reactivate", isAuthenticated, reactivateAccount);

// Add Delivery address for user
router.post("/address", isAuthenticated, authorizeRole("user"), addDeliveryAddress);

// Update a delivery address
router.put("/address/:id", isAuthenticated, authorizeRole("user"), updateDeliveryAddress);

// Delete a delivery address
router.delete("/address/:id", isAuthenticated, authorizeRole("user"), deleteDeliveryAddress);

// Verify a provider - by admin
router.patch("/providers/:id/verify", isAuthenticated, authorizeRole("admin"), verifyProvider);

export default router;
