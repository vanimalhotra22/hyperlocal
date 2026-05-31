import Booking from "../models/booking.model.js";
import findAvailableProvider from "../utils/findAvailableProvider.js";

const reassignProvider = async () => {
  const now = new Date();

  // Find bookings past provider response deadline
  const expiredBookings = await Booking.find({
    status: "awaiting_provider",
    providerResponseDeadline: { $lte: now },
  });

  for (const booking of expiredBookings) {
    try {
      // Skip if max attempts exceeded
      if (booking.providerAssignmentAttempts >= booking.maxAttempts) {
        booking.status = "unassigned";
        await booking.save();
        continue;
      }

      // Try to get new provider
      const provider = await findAvailableProvider(booking.serviceId, booking.address.location.coordinates, booking.scheduledTime);

      if (provider) {
        // Reassign with new provider and reset deadline
        booking.providerId = provider._id;
        booking.providerResponseDeadline = new Date(Date.now() + 15 * 60 * 1000);
        booking.providerAssignmentAttempts += 1;
        booking.status = "awaiting_provider";
      } else {
        // Mark booking unassigned if no one found
        booking.status = "unassigned";
      }

      await booking.save();
    } catch (error) {
      console.error(`Failed to reassign provider ${booking._id}: ${error.message}`);
    }
  }
};

export default reassignProvider;
