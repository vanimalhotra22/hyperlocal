export const categories = [
  {
    id: "home cleaning",
    name: "Home Cleaning",
    icon: "spray-can",
    image: "https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg",
    services: 12,
  },
  {
    id: "salon & spa",
    name: "Salon & Spa",
    icon: "scissors",
    image: "https://images.pexels.com/photos/3997386/pexels-photo-3997386.jpeg",
    services: 8,
  },
  {
    id: "appliance repair",
    name: "Appliance Repair",
    icon: "tool",
    image: "https://images.pexels.com/photos/4108815/pexels-photo-4108815.jpeg",
    services: 10,
  },
  {
    id: "plumbing",
    name: "Plumbing",
    icon: "droplet",
    image: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",
    services: 6,
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: "zap",
    image: "https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg",
    services: 8,
  },
  {
    id: "painting",
    name: "Painting",
    icon: "paintbrush",
    image: "https://images.pexels.com/photos/6444367/pexels-photo-6444367.jpeg",
    services: 4,
  },
  {
    id: "ac service",
    name: "AC Service",
    icon: "wind",
    image: "https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg",
    services: 5,
  },
  {
    id: "pest control",
    name: "Pest Control",
    icon: "shield",
    image: "https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg",
    services: 4,
  },
  {
    id: "gardening",
    name: "Gardening",
    icon: "flower",
    image: "https://images.pexels.com/photos/4108815/pexels-photo-4108815.jpeg",
    services: 5,
  }
];

// Map a category name to its image
export const getCategoryImage = (categoryName) => {
  const cat = categories.find(c => c.id === categoryName.toLowerCase().trim());
  return cat ? cat.image : "https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg";
};

// Map database service format to UI format expected by ServiceCard and ServiceDetails
export const mapDbServiceToUi = (dbService) => {
  if (!dbService) return null;
  return {
    id: dbService._id || dbService.id,
    name: dbService.name,
    category: dbService.category,
    price: dbService.basePrice,
    rating: dbService.rating || 4.8,
    reviews: dbService.reviewsCount || Math.floor(Math.random() * 50) + 12,
    image: getCategoryImage(dbService.category),
    description: dbService.description,
    icon: dbService.icon || "tool",
    isActive: dbService.isActive,
  };
};
