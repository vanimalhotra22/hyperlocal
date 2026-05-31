import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { api } from "../../utils/api.js";
import { mapDbServiceToUi } from "../../data/mockData.js";

const FeaturedServices = () => {
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    api.services.getAll()
      .then((res) => {
        if (res.success && res.data) {
          const mapped = res.data.slice(0, 4).map(mapDbServiceToUi).filter(Boolean);
          setFeaturedServices(mapped);
        }
      })
      .catch((err) => console.error("Failed to fetch featured services:", err));
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
            <p className="text-gray-600 max-w-2xl">Our most popular services that customers love and trust.</p>
          </div>
          <a href="/services" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            View all services
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center">
                  <Star className="h-3 w-3 text-amber-500 mr-1 fill-amber-500" />
                  <span className="text-xs font-medium">{service.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-bold">${service.price}</span>
                  <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
