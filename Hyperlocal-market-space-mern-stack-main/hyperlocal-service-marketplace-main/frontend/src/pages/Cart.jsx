import React, { useState } from "react";
import Layout from "../components/layout/Layout.jsx";
import { Clock, MapPin, Calendar, AlertCircle, CheckCircle, XCircle, ArrowRight, Star, Phone, Mail, ChevronLeft, ChevronRight, X, MessageSquare } from "lucide-react";
import { format } from "date-fns";

// Move getStatusBadge function outside of components so it's accessible to both
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          Pending
        </span>
      );
    case "confirmed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Confirmed
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completed
        </span>
      );
    default:
      return null;
  }
};

const ReviewModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment,
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} className="focus:outline-none">
                  <Star className={`h-8 w-8 ${value <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookingModal = ({ booking, onClose }) => {
  const [activeTab, setActiveTab] = (useState < "user") | ("provider" > "user");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Service Information</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="text-base font-medium text-gray-900">{booking.service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-base font-medium text-gray-900">
                    {format(new Date(booking.date), "MMMM d, yyyy")} at {booking.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(booking.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-base font-medium text-gray-900">${booking.service.price}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Provider Information</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-4">
                  <img src={booking.provider.image} alt={booking.provider.name} className="h-12 w-12 rounded-full object-cover" />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{booking.provider.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{booking.provider.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <a href={`tel:${booking.provider.phone}`} className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {booking.provider.phone}
                  </a>
                  <a href={`mailto:${booking.provider.email}`} className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {booking.provider.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {booking.status === "completed" && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab("user")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "user" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}>
                  Your Review
                </button>
                <button
                  onClick={() => setActiveTab("provider")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "provider" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}>
                  Provider's Review
                </button>
              </div>

              {activeTab === "user" &&
                (booking.review ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < booking.review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{format(new Date(booking.review.date), "MMMM d, yyyy")}</span>
                    </div>
                    <p className="text-gray-600">{booking.review.comment}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Share your experience with this service</p>
                    <button
                      onClick={() => {
                        /* Handle add review */
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Write a Review
                    </button>
                  </div>
                ))}

              {activeTab === "provider" &&
                (booking.providerReview ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < booking.providerReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{format(new Date(booking.providerReview.date), "MMMM d, yyyy")}</span>
                    </div>
                    <p className="text-gray-600">{booking.providerReview.comment}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No review from the provider yet</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Mock data for demonstration
  const pendingBookings = [
    {
      id: "1",
      service: {
        name: "Home Cleaning",
        price: 80,
        image: "https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg",
      },
      date: "2024-03-20",
      time: "10:00 AM",
      status: "pending",
      lastStep: "payment",
      provider: {
        name: "Clean Pro Services",
        rating: 4.8,
        image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
        phone: "+1 (555) 123-4567",
        email: "cleanpro@example.com",
      },
    },
    {
      id: "2",
      service: {
        name: "Deep Cleaning",
        price: 120,
        image: "https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg",
      },
      date: "2024-03-22",
      time: "2:00 PM",
      status: "pending",
      lastStep: "address",
      provider: {
        name: "Premium Cleaners",
        rating: 4.9,
        image: "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg",
        phone: "+1 (555) 987-6543",
        email: "premium@example.com",
      },
    },
  ];

  const currentBookings = [
    {
      id: "3",
      service: {
        name: "Plumbing Service",
        price: 150,
        image: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",
      },
      date: "2024-03-15",
      time: "11:00 AM",
      status: "confirmed",
      provider: {
        name: "John Smith",
        phone: "+1 (555) 123-4567",
        email: "john@example.com",
        image: "https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg",
        rating: 4.9,
      },
      payment: {
        method: "Credit Card",
        status: "Paid",
        amount: 150,
      },
    },
  ];

  // Generate dummy data for previous bookings
  const previousBookings = Array.from({ length: 10 }, (_, i) => ({
    id: `prev-${i + 1}`,
    service: {
      name: i % 2 === 0 ? "Home Cleaning" : "Plumbing Service",
      price: i % 2 === 0 ? 80 : 150,
      image: i % 2 === 0 ? "https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg" : "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",
    },
    date: format(new Date().setDate(new Date().getDate() - i * 3), "yyyy-MM-dd"),
    time: "10:00 AM",
    status: "completed",
    provider: {
      name: i % 2 === 0 ? "Clean Pro Services" : "Quick Fix Plumbers",
      phone: "+1 (555) 123-4567",
      email: "provider@example.com",
      image: i % 2 === 0 ? "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg" : "https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg",
      rating: 4.8,
    },
    review:
      i % 3 === 0
        ? {
            rating: 5,
            comment: "Excellent service! Very professional and thorough.",
            date: new Date().toISOString(),
          }
        : null,
    providerReview:
      i % 4 === 0
        ? {
            rating: 5,
            comment: "Great customer! Very cooperative and punctual.",
            date: new Date().toISOString(),
          }
        : null,
    payment: {
      method: "Credit Card",
      status: "Paid",
      amount: i % 2 === 0 ? 80 : 150,
    },
  }));

  // Calculate pagination
  const totalPages = Math.ceil(previousBookings.length / itemsPerPage);
  const paginatedBookings = previousBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleReviewSubmit = (review) => {
    // In a real app, this would make an API call to save the review
    console.log("Review submitted:", review);

    // Update the booking with the new review
    const updatedBooking = {
      ...selectedBooking,
      review: review,
    };

    // Close the review modal
    setShowReviewModal(false);

    // Show the updated booking details
    setSelectedBooking(updatedBooking);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

            {/* Pending Bookings Section */}
            {pendingBookings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Booking</h2>
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-yellow-200">
                      <div className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={booking.service.image} alt={booking.service.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">{booking.service.name}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{booking.time}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center">
                              <div className="flex items-center">
                                <img src={booking.provider.image} alt={booking.provider.name} className="h-8 w-8 rounded-full object-cover" />
                                <span className="ml-2 text-sm text-gray-900">{booking.provider.name}</span>
                              </div>
                              <div className="ml-4 px-2 py-1 bg-green-50 rounded-full text-sm text-green-700">★ {booking.provider.rating}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">${booking.service.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-yellow-50">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-yellow-800">
                            Last completed step: <span className="font-medium">{booking.lastStep}</span>
                          </p>
                          <a
                            href={`/booking?id=${booking.id}`}
                            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                            Continue Booking
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Bookings Section */}
            {currentBookings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Bookings</h2>
                <div className="space-y-4">
                  {currentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedBooking(booking)}>
                      <div className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={booking.service.image} alt={booking.service.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">{booking.service.name}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{booking.time}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center">
                              <div className="flex items-center">
                                <img src={booking.provider.image} alt={booking.provider.name} className="h-8 w-8 rounded-full object-cover" />
                                <span className="ml-2 text-sm text-gray-900">{booking.provider.name}</span>
                              </div>
                              <div className="ml-4 px-2 py-1 bg-green-50 rounded-full text-sm text-green-700">★ {booking.provider.rating}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">${booking.service.price}</span>
                            <p className="text-sm text-gray-500 mt-1">{booking.payment.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Bookings Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Bookings</h2>
              <div className="space-y-4">
                {paginatedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedBooking(booking)}>
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={booking.service.image} alt={booking.service.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{booking.service.name}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <img src={booking.provider.image} alt={booking.provider.name} className="h-8 w-8 rounded-full object-cover" />
                              <span className="ml-2 text-sm text-gray-900">{booking.provider.name}</span>
                            </div>
                            {booking.review ? (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < booking.review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                ))}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBooking(booking);
                                  setShowReviewModal(true);
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                Add Review
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">${booking.service.price}</span>
                          <p className="text-sm text-gray-500 mt-1">{booking.payment.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && !showReviewModal && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && <ReviewModal booking={selectedBooking} onClose={() => setShowReviewModal(false)} onSubmit={handleReviewSubmit} />}
    </Layout>
  );
};

export default Cart;
