import Booking from "../models/booking.model.js";
import ProviderProfile from "../models/providerProfile.model.js";

const findAvailableProvider = async (serviceId, locationCoordinates, scheduleTime, durationMinutes = 60) => {
  try {
    // Get day ('mon', 'tue', etc) and hour (0 - 23)
    const day = scheduleTime.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
    const hour = scheduleTime.getHours();

    // Calculate estimated work duration
    const estimatedStart = new Date(scheduleTime);
    const estimatedEnd = new Date(scheduleTime);
    estimatedEnd.setMinutes(estimatedEnd.getMinutes() + durationMinutes);

    // Find provider profiles
    const profiles = await ProviderProfile.find({
      servicesOfferedIds: serviceId,
      isVerified: true,
      "availability.day": day,
      "availability.fromTime": { $lte: hour },
      "availability.toTime": { $gte: hour },
      "serviceAreas.location": {
        $near: {
          $geometry: { type: "Point", coordinates: locationCoordinates },
          $maxDistance: 5000,
        },
      },
    }).populate("userId", "name email profilePhoto phone isActive");

    const providerIds = profiles.map((p) => p.userId?._id).filter(Boolean);

    // Get provider IDs who already have bookings that overlap
    const busyProviders = await Booking.find({
      providerId: { $in: providerIds },
      status: { $in: ["scheduled", "in_progress"] },
      $or: [
        {
          workStartTime: { $lt: estimatedEnd },
          workEndTime: { $gt: estimatedStart },
        },
        {
          scheduleTime: {
            $gte: estimatedStart,
            $lte: estimatedEnd,
          },
        },
      ],
    }).distinct("providerId");

    // Filter out busy or inactive providers
    const availableProfile = profiles.find((p) => p.userId && p.userId.isActive && !busyProviders.includes(p.userId._id.toString()));

    return availableProfile?.userId || null;
  } catch (error) {
    console.error("Error finding provider", error.message);
    return null;
  }
};

export default findAvailableProvider;
