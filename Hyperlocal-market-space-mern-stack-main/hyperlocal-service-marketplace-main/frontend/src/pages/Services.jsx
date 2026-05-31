import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';
import { categories, mapDbServiceToUi } from '../data/mockData.js';
import { Filter, Star, ChevronDown, Search, X } from 'lucide-react';
import { useServiceSearch } from '../contexts/serviceSearchContext.jsx';
import { api } from '../utils/api.js';

const Services = () => {
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { searchTerm, setSearchTerm, clearSearch } = useServiceSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Fetch all services from the backend on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await api.services.getAll();
        if (response.success && response.data) {
          const mapped = response.data.map(s => mapDbServiceToUi(s));
          setAllServices(mapped);
          setFilteredServices(mapped);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Initialize search term from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSearchTerm = params.get('search');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      setLocalSearchTerm(urlSearchTerm);
    }
  }, [setSearchTerm]);

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm]);

  // Apply filters and search
  useEffect(() => {
    if (allServices.length === 0) return;
    
    let result = [...allServices];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(service => 
        service.name.toLowerCase().includes(searchLower) ||
        (service.description && service.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(service => service.category.toLowerCase().trim() === activeCategory.toLowerCase().trim());
    }

    // Price range filter
    result = result.filter(
      service => service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredServices(result);
  }, [searchTerm, activeCategory, sortBy, priceRange, allServices]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    clearSearch();
  };

  return (
    <Layout>
      <div className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
          <p className="text-indigo-100">Discover and book professional services</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">Filters</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Categories</h2>
              <div className="space-y-2 mb-8">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`block w-full text-left py-2 px-3 rounded-md transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`block w-full text-left py-2 px-3 rounded-md transition-colors ${
                      activeCategory === category.id
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-4">Price Range</h2>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-4">Rating</h2>
                <div className="space-y-2">
                  {[5, 4, 3, 2].map(rating => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {isLoading ? 'Searching...' : `${filteredServices.length} services found`}
              </p>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-xl" />
                    <div className="bg-white p-4 rounded-b-xl">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services