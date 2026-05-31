import express from "express";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.middleware.js";
import { getAllServices, getServiceById, createService, updateService, deleteService, getGroupedServices } from "../controllers/service.controller.js";

const router = express.Router();

// Get all services
router.get("/", getAllServices);

// Get all serices grouped by category
router.get("/grouped", getGroupedServices);

// Get specific service using its ID
router.get("/:id", getServiceById);

// Create a new service - admin only
router.post("/", isAuthenticated, authorizeRole("admin"), createService);

// Update a existing service - admin only
router.put("/:id", isAuthenticated, authorizeRole("admin"), updateService);

// Delete a serice using id - admin only
router.delete("/:id", isAuthenticated, authorizeRole("admin"), deleteService);

export default router;
