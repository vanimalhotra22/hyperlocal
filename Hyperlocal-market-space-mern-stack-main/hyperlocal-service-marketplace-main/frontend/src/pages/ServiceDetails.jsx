import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout.jsx';
import { categories, mapDbServiceToUi } from "../data/mockData.js";
import { Star, Clock, Check, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../utils/api.js';

const ServiceDetails = () => {
  const serviceId = window.location.pathname.split("/").pop() || "";
  
  const [service, setService] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [expandedSection, setExpandedSection] = useState('description');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch service details
        const res = await api.services.getById(serviceId);
        if (res.success && res.data) {
          const mapped = mapDbServiceToUi(res.data);
          setService(mapped);
        }

        // Fetch providers and filter those who offer this service
        const providersRes = await api.users.getAllProviders();
        if (providersRes.success && providersRes.data) {
          const qualified = providersRes.data.filter(prov => 
            prov.providerProfile && 
            prov.providerProfile.servicesOfferedIds.includes(serviceId) &&
            prov.providerProfile.isVerified
          );
          setServiceProviders(qualified);
        }
      } catch (error) {
        console.error("Failed to load service details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (serviceId) {
      fetchDetails();
    }
  }, [serviceId]);
  
  // Generate next 7 days for booking
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      
      dates.push({ dateString, dayName, dayNumber });
    }
    
    return dates;
  };
  
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const handleBookAppointment = () => {
    // Redirect to booking page with selected service, date, and time
    window.location.href = `/booking?service=${serviceId}&date=${selectedDate}&time=${selectedTime}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300">Loading service details...</p>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
          <p className="text-gray-500">Service not found</p>
        </div>
      </Layout>
    );
  }

  const categoryInfo = categories.find(c => c.id === service.category);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Service Info */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100 dark:border-slate-700">
              <div className="relative h-64 md:h-96">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-2">
                  <div className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1 rounded-full">
                    {categoryInfo ? categoryInfo.name : service.category}
                  </div>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                    <span className="font-medium dark:text-white">{service.rating}</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{service.reviews} reviews</span>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{service.name}</h1>
                
                <div className="flex items-center mb-6">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">60-90 min</span>
                  <span className="mx-3 text-gray-300">|</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">${service.price}</span>
                </div>
                
                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">Service Description</h2>
                    <button 
                      onClick={() => toggleSection('description')}
                      className="text-gray-500 hover:text-indigo-600"
                    >
                      {expandedSection === 'description' ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {expandedSection === 'description' && (
                    <div className="text-gray-600 dark:text-gray-300 mb-6">
                      <p className="mb-4">{service.description}</p>
                      <p>Our professional partners use top-grade equipment and follow detailed checklists to guarantee satisfaction. This service includes:</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Complete diagnostic checks</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Standard labor and troubleshooting</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Sanitization of the service area post-work</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">Inclusions & Exclusions</h2>
                    <button 
                      onClick={() => toggleSection('inclusions')}
                      className="text-gray-500 hover:text-indigo-600"
                    >
                      {expandedSection === 'inclusions' ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {expandedSection === 'inclusions' && (
                    <div className="mb-6 text-gray-600 dark:text-gray-300">
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">What's Included:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Verified professional background-checked team</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Service coverage warranty of 15 days</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">What's Not Included:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 flex items-center justify-center">
                              <span className="block h-0.5 w-3 bg-current"></span>
                            </div>
                            <span>Additional spare parts or structural enhancements (charged separately)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">Service Providers</h2>
                    <button 
                      onClick={() => toggleSection('providers')}
                      className="text-gray-500 hover:text-indigo-600"
                    >
                      {expandedSection === 'providers' ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {expandedSection === 'providers' && (
                    <div className="space-y-4 mb-6">
                      {serviceProviders.length > 0 ? (
                        serviceProviders.map(provider => (
                          <div key={provider._id} className="flex items-center p-4 border border-gray-100 dark:border-slate-700 rounded-lg">
                            <img
                              src={provider.profilePhoto || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"}
                              alt={provider.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white">{provider.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Star className="h-3 w-3 text-amber-500 mr-1 fill-amber-500" />
                                <span>{provider.providerProfile.rating || 4.9}</span>
                                <span className="mx-1 text-gray-400">•</span>
                                <span>{provider.providerProfile.experience} years experience</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No specific providers verified in this area yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Booking */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Book This Service</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Select Date</h3>
                <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin">
                  {getDates().map(date => (
                    <button
                      key={date.dateString}
                      onClick={() => setSelectedDate(date.dateString)}
                      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDate === date.dateString
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'border-gray-200 dark:border-slate-700 hover:border-indigo-200 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-sm">{date.dayName}</span>
                      <span className="text-lg font-semibold">{date.dayNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Select Time</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                          selectedTime === time
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'border-gray-200 dark:border-slate-700 hover:border-indigo-200 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-100 dark:border-slate-700 my-6 pt-6 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between mb-2">
                  <span>Service Price</span>
                  <span className="font-semibold text-gray-950 dark:text-white">${service.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service Fee</span>
                  <span className="font-semibold text-gray-950 dark:text-white">$5.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${service.price + 5}</span>
                </div>
              </div>
              
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={handleBookAppointment}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center cursor-pointer transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Verify details in checkout. Cancellation is free up to 3 hours before start time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetails;