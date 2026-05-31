import cron from "node-cron";
import reassignProvider from "../job/reassignProviders.job.js";

export const startReassigningProvider = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("[CRON] Checking for expired bookings...");
    await reassignProvider();
  });
};
