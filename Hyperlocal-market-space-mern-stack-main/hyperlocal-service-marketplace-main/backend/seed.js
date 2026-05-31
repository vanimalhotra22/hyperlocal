import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import dns from "dns";
import User from "./models/user.model.js";
import ProviderProfile from "./models/providerProfile.model.js";
import Service from "./models/service.model.js";
import Booking from "./models/booking.model.js";
import Review from "./models/review.model.js";

dotenv.config();

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const servicesData = [
  {
    name: "Basic Home Cleaning",
    category: "home cleaning",
    basePrice: 49,
    icon: "spray-can",
    description: "Professional home cleaning service includes dusting, vacuuming, mopping, and bathroom cleaning."
  },
  {
    name: "Deep Home Cleaning",
    category: "home cleaning",
    basePrice: 99,
    icon: "brush",
    description: "Thorough deep cleaning service includes everything in basic cleaning plus inside appliances, cabinet cleaning, and window sill washing."
  },
  {
    name: "Women's Haircut & Styling",
    category: "salon & spa",
    basePrice: 45,
    icon: "scissors",
    description: "Professional haircut, hair wash, blow dry, and styling by experienced stylists."
  },
  {
    name: "Men's Haircut & Shave",
    category: "salon & spa",
    basePrice: 25,
    icon: "scissors",
    description: "Classic men's haircut including wash, head massage, styling, and beard grooming."
  },
  {
    name: "Refrigerator Repair",
    category: "appliance repair",
    basePrice: 79,
    icon: "tool",
    description: "Expert repair service for cooling issues, leakage, gas charging, and all refrigerator brands."
  },
  {
    name: "Washing Machine Repair",
    category: "appliance repair",
    basePrice: 69,
    icon: "tool",
    description: "Professional washing machine repair for drum issues, motor faults, water drain issues, and circuit board errors."
  },
  {
    name: "Standard Plumbing Service",
    category: "plumbing",
    basePrice: 39,
    icon: "droplet",
    description: "Fixing clogged drains, leakage inspection, washer replacements, and simple pipe repairs."
  },
  {
    name: "Complete Tap & Pipe Fixing",
    category: "plumbing",
    basePrice: 59,
    icon: "droplet",
    description: "Installation and replacement of bathroom taps, kitchen sinks, showers, and pipelines."
  },
  {
    name: "Electrical Fan/Light Installation",
    category: "electrical",
    basePrice: 29,
    icon: "zap",
    description: "Installing ceiling fans, decorative lights, LEDs, and simple wiring checks."
  },
  {
    name: "Switchboard Repair & Service",
    category: "electrical",
    basePrice: 49,
    icon: "zap",
    description: "Fixing faulty switches, sockets, short circuits, and replacement of fuse boards."
  },
  {
    name: "AC Service & Gas Fill",
    category: "ac service",
    basePrice: 89,
    icon: "wind",
    description: "Full wet servicing of split or window AC, filter cleaning, cooling check, and gas top-up."
  },
  {
    name: "AC Installation",
    category: "ac service",
    basePrice: 119,
    icon: "wind",
    description: "Professional AC mounting, indoor and outdoor unit setup, piping, and wiring calibration."
  },
  {
    name: "Wall Painting & Touch-up",
    category: "painting",
    basePrice: 149,
    icon: "paintbrush",
    description: "Single room wall painting, primer coating, wallpaper removal, and minor wall crack repairs."
  },
  {
    name: "Pest Control & Disinfection",
    category: "pest control",
    basePrice: 79,
    icon: "shield",
    description: "Eco-friendly pest control for cockroaches, ants, termites, and bed bugs with 90-day warranty."
  },
  {
    name: "Lawn Care & Gardening",
    category: "gardening",
    basePrice: 35,
    icon: "flower",
    description: "Lawn mowing, trimming weeds, plant potting, garden cleanup, and fertilizing."
  }
];

const seed = async () => {
  try {
   console.log("MONGODB_URI =", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await ProviderProfile.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log("Data cleared.");

    // Seed Services
    console.log("Seeding services...");
    const seededServices = await Service.insertMany(servicesData);
    console.log(`Seeded ${seededServices.length} services.`);

    // Helper map of service names to MongoDB ObjectId
    const getServiceId = (name) => seededServices.find(s => s.name === name)._id;

    // Hashed Password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create Users
    console.log("Creating users...");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      phone: "+919999999999",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      phoneVerified: true
    });

    const user = await User.create({
      name: "Regular User",
      email: "user@example.com",
      phone: "+919876543210",
      password: hashedPassword,
      role: "user",
      emailVerified: true,
      phoneVerified: true,
      deliveryAddresses: [
        {
          label: "home",
          street: "123 Main St, Manhattan",
          city: "New York",
          state: "NY",
          pincode: "10001",
          location: {
            type: "Point",
            coordinates: [-74.0060, 40.7128] // NYC Center
          }
        }
      ]
    });

    const providerUser1 = await User.create({
      name: "Alex Johnson",
      email: "provider@example.com",
      phone: "+918888888888",
      password: hashedPassword,
      role: "provider",
      profilePhoto: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      emailVerified: true,
      phoneVerified: true
    });

    const providerUser2 = await User.create({
      name: "Sophia Martinez",
      email: "provider2@example.com",
      phone: "+917777777777",
      password: hashedPassword,
      role: "provider",
      profilePhoto: "https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg",
      emailVerified: true,
      phoneVerified: true
    });

    const providerUser3 = await User.create({
      name: "Michael Roberts",
      email: "provider3@example.com",
      phone: "+916666666666",
      password: hashedPassword,
      role: "provider",
      profilePhoto: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      emailVerified: true,
      phoneVerified: true
    });

    console.log("Users created.");

    // Create Provider Profiles (Verified and available around NYC)
    console.log("Creating provider profiles...");
    const availabilityDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => ({
      day,
      fromTime: 0,
      toTime: 23
    }));

    await ProviderProfile.create({
      userId: providerUser1._id,
      bio: "Professional cleaner with 5+ years of experience in home and office cleaning.",
      experience: 5,
      isVerified: true,
      availability: availabilityDays,
      servicesOfferedIds: [
        getServiceId("Basic Home Cleaning"),
        getServiceId("Deep Home Cleaning"),
        getServiceId("Pest Control & Disinfection")
      ],
      serviceAreas: [
        {
          label: "New York Area",
          location: {
            type: "Point",
            coordinates: [-74.0060, 40.7128]
          },
          radiusMeters: 20000
        }
      ]
    });

    await ProviderProfile.create({
      userId: providerUser2._id,
      bio: "Certified hairstylist and beauty expert with expertise in latest trends and techniques.",
      experience: 7,
      isVerified: true,
      availability: availabilityDays,
      servicesOfferedIds: [
        getServiceId("Women's Haircut & Styling"),
        getServiceId("Men's Haircut & Shave")
      ],
      serviceAreas: [
        {
          label: "New York Area",
          location: {
            type: "Point",
            coordinates: [-74.0060, 40.7128]
          },
          radiusMeters: 20000
        }
      ]
    });

    await ProviderProfile.create({
      userId: providerUser3._id,
      bio: "Certified appliance technician and electrician with expertise in troubleshooting and fast repair.",
      experience: 8,
      isVerified: true,
      availability: availabilityDays,
      servicesOfferedIds: [
        getServiceId("Refrigerator Repair"),
        getServiceId("Washing Machine Repair"),
        getServiceId("Electrical Fan/Light Installation"),
        getServiceId("Switchboard Repair & Service"),
        getServiceId("AC Service & Gas Fill"),
        getServiceId("AC Installation"),
        getServiceId("Standard Plumbing Service"),
        getServiceId("Complete Tap & Pipe Fixing"),
        getServiceId("Lawn Care & Gardening"),
        getServiceId("Wall Painting & Touch-up")
      ],
      serviceAreas: [
        {
          label: "New York Area",
          location: {
            type: "Point",
            coordinates: [-74.0060, 40.7128]
          },
          radiusMeters: 20000
        }
      ]
    });

    console.log("Provider profiles created successfully.");
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
