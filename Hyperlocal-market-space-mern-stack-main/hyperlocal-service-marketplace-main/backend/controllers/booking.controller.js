import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import handleError from "../utils/handleError.js";
import findAvailableProvider from "../utils/findAvailableProvider.js";

/* Get all booking (admin only) */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .populate("userId", "name email role phone profilePhoto")
      .populate("providerId", "name email role phone profilePhoto")
      .populate("serviceId", "name description category basePrice icon");

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch all bookings");
  }
};

/* Get all bookings for user*/
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 })
      .populate("providerId", "name email role phone profilePhoto")
      .populate("serviceId", "name description category basePrice icon");

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch user bookings");
  }
};

/* Get all bookings for provider */
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 })
      .populate("userId", "name email role phone profilePhoto")
      .populate("serviceId", "name description category basePrice icon");

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch provider bookings");
  }
};

/* Get single booking by ID */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .select("-__v")
      .populate("userId", "name email role phone profilePhoto")
      .populate("providerId", "name email role phone profilePhoto")
      .populate("serviceId", "name description category basePrice icon");

    if (!booking) {
      return handleError(res, "Booking not found", 404);
    }

    // allow to view booking only if admin or owner
    const isOwner = req.user._id.equals(booking.userId) || req.user._id.equals(booking.providerId);
    if (!isOwner && req.user.role !== "admin") {
      return handleError(res, "You are not authorized to view this booking", 403);
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to fetch booking");
  }
};

/* Create a booking (user only) */
export const createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledTime, address, notes } = req.body;
    if (!serviceId || !scheduledTime || !address?.location?.coordinates) {
      return handleError(res, "Missing required fields", 400);
    }

    // Check for service is valid or not
    const service = await Service.findById(serviceId);
    if (!service) {
      return handleError(res, "Service not found", 404);
    }

    if (!service.isActive) {
      return handleError(res, "Service is not currently active", 403);
    }

    const startTime = new Date(scheduledTime);
    const endTime = new Date(scheduledTime);
    const defaultDurationMinutes = 60;
    endTime.setMinutes(endTime.getMinutes() + defaultDurationMinutes);

    // Get the nearest and avaialble provider
    const provider = await findAvailableProvider(serviceId, address.location.coordinates, startTime, defaultDurationMinutes);
    if (!provider) {
      return handleError(res, "No available provider for this service at the selected time/location", 409);
    }

    const deadline = new Date(Date.now() + 15 * 60 * 1000); // 15 min for provider to accept

    const booking = await Booking.create({
      userId: req.user._id,
      providerId: provider._id,
      serviceId,
      scheduledTime,
      status: "awaiting_provider",
      workStartTime: startTime,
      workEndTime: endTime,
      address,
      amount: service.basePrice,
      notes: notes || "",
      providerResponseDeadline: deadline,
      providerAssignmentAttempts: 1,
    });

    return res.status(201).json({
      success: true,
      message: "Booking successfully created and assigned",
      data: booking,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to create booking");
  }
};

/* Update booking staus - user (cancel), provider(accept/reject), admin(override) */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, durationMinutes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return handleError(res, "Booking not found", 404);

    // User updated (can cancel only their own booking)
    if (req.user.role === "user") {
      if (!booking.userId.equals(req.user._id)) {
        return handleError(res, "You can't update this booking", 403);
      }
      if (status !== "cancelled") {
        return handleError(res, "Users can only cancel booking", 403);
      }
    }

    // Provider updates (accept/mark complete)
    if (req.user.role === "provider") {
      if (!booking.providerId.equals(req.user._id)) {
        return handleError(res, "You can't update this booking", 403);
      }

      // Provider cancels the booking (release it for reassignment)
      if (status === "cancelled") {
        booking.status = "awaiting_provider";
        booking.providerId = null;
        booking.providerResponseDeadline = new Date(Date.now() + 15 * 60 * 1000);
        booking.providerAssignmentAttempts += 1;

        await booking.save();
        return res.status(200).json({
          success: true,
          message: "Booking released for reassignment",
          data: booking,
        });
      }

      // Provider accepts the booking (from 'awaiting_provider' to 'scheduled')
      if (status === "scheduled") {
        if (booking.status !== "awaiting_provider") {
          return handleError(res, "Only aawaiting bookings can be accepted", 400);
        }

        booking.status = "scheduled";
        await booking.save();

        return res.status(200).json({
          success: true,
          message: "Booking accepted and scheduled",
          data: booking,
        });
      }

      // Provider starts job (from 'scheduled' to 'in_progress')
      if (status === "in_progress") {
        if (booking.status !== "scheduled") {
          return handleError(res, "Booking must be in scheduled status to start", 400);
        }

        if (!durationMinutes || durationMinutes <= 0) {
          return handleError(res, "Please provide a valid duration (in minutes)", 400);
        }

        const startTime = new Date(booking.scheduledTime);
        const endTime = new Date(booking.scheduledTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);

        booking.status = "in_progress";
        booking.workStartTime = startTime;
        booking.workEndTime = endTime;
        await booking.save();

        return res.status(200).json({
          success: true,
          message: "Work started and time updated",
          data: booking,
        });
      }

      // Provider marks the booking completed
      if (status === "completed") {
        if (booking.status !== "in_progress") {
          return handleError(res, "Only in progress bookings can be marked complete", 400);
        }

        booking.status = "completed";
        booking.workEndTime = new Date();
        await booking.save();

        return res.status(200).json({
          success: true,
          message: "Booking completed",
          data: booking,
        });
      }

      return handleError(res, "Invalid status udpate for provider", 403);
    }

    if (req.user.role === "admin") {
      booking.status = status;
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status updated",
      data: booking,
    });
  } catch (error) {
    return handleError(res, error, 500, "Failed to update booking");
  }
};
