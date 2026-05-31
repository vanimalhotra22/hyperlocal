import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout.jsx";
import ServiceCard from "../../components/services/ServiceCard.jsx";
import { categories, mapDbServiceToUi } from "../../data/mockData.js";
import { Filter, Search, MapPin } from "lucide-react";
import { api } from "../../utils/api.js";

const CategoryPage = () => {
  const categoryId = window.location.pathname.split("/").pop() || "";
  const category = categories.find((c) => c.id === categoryId);

  const [categoryServices, setCategoryServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategoryServices = async () => {
      try {
        setIsLoading(true);
        const response = await api.services.getAll();
        if (response.success && response.data) {
          const filteredMapped = response.data
            .filter((s) => s.category.toLowerCase().trim() === categoryId.toLowerCase().trim())
            .map((s) => mapDbServiceToUi(s));
          setCategoryServices(filteredMapped);
        }
      } catch (error) {
        console.error("Failed to load category services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryServices();
  }, [categoryId]);

  if (!category) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Category not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
          <p className="text-indigo-100">Find and book the best {category.name.toLowerCase()} services</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Location Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Your location"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search ${category.name.toLowerCase()} services...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                  <Filter className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">${priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Rating</h3>
                  {[5, 4, 3, 2].map((rating) => (
                    <label key={rating} className="flex items-center mt-2">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-600">{rating} Stars & Above</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {categoryServices.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
