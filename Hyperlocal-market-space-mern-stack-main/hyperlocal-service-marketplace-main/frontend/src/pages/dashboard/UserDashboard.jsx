import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout.jsx";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  CreditCard,
  X,
  Filter,
  Search,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { api } from "../../utils/api.js";
import { getCategoryImage } from "../../data/mockData.js";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTab, setReviewsTab] = useState("given");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [paymentStatus, setPaymentStatus] = useState("all");

  // API State
  const [dbBookings, setDbBookings] = useState([]);
  const [dbReviews, setDbReviews] = useState({ reviewsGiven: [], reviewsReceived: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const bookingsRes = await api.bookings.getUserBookings();
      const reviewsRes = await api.reviews.getMyReviews();
      if (bookingsRes.success) {
        setDbBookings(bookingsRes.data || []);
      }
      if (reviewsRes.success) {
        setDbReviews(reviewsRes.data || { reviewsGiven: [], reviewsReceived: [] });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await api.bookings.updateStatus(bookingId, "cancelled");
      if (res.success) {
        alert("Booking cancelled successfully!");
        setSelectedBooking(null);
        fetchData();
      }
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBookingId) return;
    setIsSubmittingReview(true);
    try {
      const res = await api.reviews.create({
        bookingId: reviewBookingId,
        rating: reviewRating,
        review: reviewComment,
      });
      if (res.success) {
        alert("Review submitted successfully!");
        setIsReviewModalOpen(false);
        setReviewBookingId("");
        setReviewRating(5);
        setReviewComment("");
        fetchData();
      }
    } catch (err) {
      alert(err.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const mapDbBookingToUi = (dbBooking) => {
    if (!dbBooking) return null;
    
    let dateStr = "2026-05-31";
    let timeStr = "12:00 PM";
    if (dbBooking.scheduledTime) {
      try {
        const d = new Date(dbBooking.scheduledTime);
        dateStr = d.toISOString().split('T')[0];
        timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        console.error(e);
      }
    }

    const categoryName = dbBooking.serviceId?.category || "home cleaning";
    const image = getCategoryImage(categoryName);

    // Find review for this booking
    const matchingReview = dbReviews.reviewsGiven?.find(r => r.bookingId === dbBooking._id || r.bookingId === dbBooking.id);

    return {
      id: dbBooking._id || dbBooking.id,
      service: {
        name: dbBooking.serviceId?.name || "Service",
        price: dbBooking.amount || 0,
        image: image,
      },
      provider: {
        name: dbBooking.providerId?.name || "Assigning Provider...",
        image: dbBooking.providerId?.profilePhoto || "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
        rating: 4.8,
        phone: dbBooking.providerId?.phone || "N/A",
        email: dbBooking.providerId?.email || "N/A",
      },
      date: dateStr,
      time: timeStr,
      status: dbBooking.status === "in_progress" ? "in-progress" : dbBooking.status,
      address: dbBooking.address ? `${dbBooking.address.street}, ${dbBooking.address.city}, ${dbBooking.address.state} ${dbBooking.address.pincode}` : "N/A",
      payment: {
        method: "Cash/Card on service",
        status: dbBooking.paymentStatus || "pending",
        amount: dbBooking.amount || 0,
        transactionId: dbBooking._id || "TXN",
        date: dateStr,
      },
      review: matchingReview ? {
        rating: matchingReview.rating,
        comment: matchingReview.review,
        date: matchingReview.createdAt ? matchingReview.createdAt.split('T')[0] : dateStr,
      } : null
    };
  };

  const uiBookings = dbBookings.map(mapDbBookingToUi).filter(Boolean);

  const inProcessBookings = uiBookings.filter(
    (b) => b.status === "awaiting_provider" || b.status === "scheduled" || b.status === "in-progress" || b.status === "unassigned"
  );

  const previousBookings = uiBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const payments = uiBookings.map(b => ({
    id: b.id,
    date: b.date,
    amount: b.payment.amount,
    method: b.payment.method,
    status: b.payment.status === "paid" ? "Completed" : b.payment.status,
    transactionId: b.payment.transactionId,
    booking: b
  }));

  const reviews = [
    ...(dbReviews.reviewsGiven || []).map(r => {
      const associatedBooking = uiBookings.find(b => b.id === r.bookingId) || {
        service: { name: "Service", image: "https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg" },
        provider: { name: "Provider" }
      };
      return {
        id: r._id || r.id,
        type: "given",
        rating: r.rating,
        comment: r.review,
        date: r.createdAt ? r.createdAt.split('T')[0] : "2026-05-31",
        booking: associatedBooking
      };
    }),
    ...(dbReviews.reviewsReceived || []).map(r => {
      const associatedBooking = uiBookings.find(b => b.id === r.bookingId) || {
        service: { name: "Service", image: "https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg" },
        provider: { name: "Provider" }
      };
      return {
        id: r._id || r.id,
        type: "received",
        rating: r.rating,
        comment: r.review,
        date: r.createdAt ? r.createdAt.split('T')[0] : "2026-05-31",
        booking: associatedBooking
      };
    })
  ];

  const stats = {
    totalBookings: uiBookings.length,
    totalSpent: uiBookings
      .filter(b => b.status === "completed" || b.payment.status === "paid")
      .reduce((sum, b) => sum + b.service.price, 0)
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "awaiting_provider":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            Awaiting Provider
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Calendar className="w-4 h-4 mr-1" />
            Scheduled
          </span>
        );
      case "in-progress":
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-4 h-4 mr-1" />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-1" />
            Cancelled
          </span>
        );
      case "unassigned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-4 h-4 mr-1" />
            Unassigned
          </span>
        );
      default:
        return null;
    }
  };

  const renderBookingModal = () => {
    if (!selectedBooking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Service Information</h4>
                <img src={selectedBooking.service.image} alt={selectedBooking.service.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Service</dt>
                    <dd className="text-sm text-gray-900">{selectedBooking.service.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                    <dd className="text-sm text-gray-900">
                      {format(parseISO(selectedBooking.date), "MMMM d, yyyy")} at {selectedBooking.time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm">{getStatusBadge(selectedBooking.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900">{selectedBooking.address}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Provider Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <img src={selectedBooking.provider.image} alt={selectedBooking.provider.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{selectedBooking.provider.name}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{selectedBooking.provider.rating}</span>
                      </div>
                    </div>
                  </div>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{selectedBooking.provider.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{selectedBooking.provider.email}</dd>
                    </div>
                  </dl>
                </div>

                <h4 className="font-medium text-gray-900 mt-6 mb-4">Payment Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="text-sm text-gray-900">${selectedBooking.payment.amount}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                      <dd className="text-sm text-gray-900">{selectedBooking.payment.method}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                      <dd className="text-sm text-gray-900">{selectedBooking.payment.transactionId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                      <dd className="text-sm text-gray-900">{selectedBooking.payment.status}</dd>
                    </div>
                  </dl>
                </div>

                {selectedBooking.review && (
                  <>
                    <h4 className="font-medium text-gray-900 mt-6 mb-4">Your Review</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < selectedBooking.review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{format(parseISO(selectedBooking.review.date), "MMMM d, yyyy")}</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedBooking.review.comment}</p>
                    </div>
                  </>
                )}

                {(selectedBooking.status === "awaiting_provider" || selectedBooking.status === "scheduled") && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    Cancel Booking
                  </button>
                )}

                {selectedBooking.status === "completed" && !selectedBooking.review && (
                  <button
                    onClick={() => {
                      setReviewBookingId(selectedBooking.id);
                      setIsReviewModalOpen(true);
                      setSelectedBooking(null);
                    }}
                    className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Payment Details</h3>
              <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Payment Information</h4>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedPayment.transactionId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900">${selectedPayment.amount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedPayment.method}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedPayment.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{format(parseISO(selectedPayment.date), "MMMM d, yyyy")}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Associated Booking</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <img src={selectedPayment.booking.service.image} alt={selectedPayment.booking.service.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{selectedPayment.booking.service.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(parseISO(selectedPayment.booking.date), "MMMM d, yyyy")} at {selectedPayment.booking.time}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Provider</h5>
                    <div className="flex items-center">
                      <img src={selectedPayment.booking.provider.image} alt={selectedPayment.booking.provider.name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{selectedPayment.booking.provider.name}</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">{selectedPayment.booking.provider.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewModal = () => {
    if (!selectedReview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Review Details</h3>
              <button onClick={() => setSelectedReview(null)} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">Review</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{format(parseISO(selectedReview.date), "MMMM d, yyyy")}</span>
                </div>
                <p className="text-gray-600">{selectedReview.comment}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Service Information</h4>
                <img src={selectedReview.booking.service.image} alt={selectedReview.booking.service.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Service</dt>
                    <dd className="text-sm text-gray-900">{selectedReview.booking.service.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                    <dd className="text-sm text-gray-900">
                      {format(parseISO(selectedReview.booking.date), "MMMM d, yyyy")} at {selectedReview.booking.time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm">{getStatusBadge(selectedReview.booking.status)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Provider Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <img src={selectedReview.booking.provider.image} alt={selectedReview.booking.provider.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{selectedReview.booking.provider.name}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{selectedReview.booking.provider.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingsTab = () => (
    <div className="space-y-8">
      {/* In Process Bookings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">In Process Bookings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {inProcessBookings.map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedBooking(booking)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={booking.service.image} alt={booking.service.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{booking.service.name}</h4>
                    <p className="text-sm text-gray-500">{booking.provider.name}</p>
                  </div>
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {format(parseISO(booking.date), "MMMM d, yyyy")}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {booking.time}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">${booking.service.price}</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Bookings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Previous Bookings</h3>
            <div className="flex items-center space-x-4">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-md text-sm">
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="status">By Status</option>
              </select>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {previousBookings.map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedBooking(booking)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={booking.service.image} alt={booking.service.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{booking.service.name}</h4>
                    <p className="text-sm text-gray-500">{booking.provider.name}</p>
                  </div>
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {format(parseISO(booking.date), "MMMM d, yyyy")}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {booking.time}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  {booking.review && (
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < booking.review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  )}
                  <span className="text-lg font-semibold text-gray-900">${booking.service.price}</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details</button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setBookingsPage(Math.max(1, bookingsPage - 1))}
            disabled={bookingsPage === 1}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {bookingsPage} of {Math.ceil(previousBookings.length / 10)}
          </span>
          <button
            onClick={() => setBookingsPage(bookingsPage + 1)}
            disabled={bookingsPage >= Math.ceil(previousBookings.length / 10)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full border border-gray-300 rounded-md shadow-sm">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {payments.map((payment) => (
            <div key={payment.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedPayment(payment)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Payment for {payment.booking.service.name}</h4>
                    <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-gray-900">${payment.amount}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {format(parseISO(payment.date), "MMMM d, yyyy")}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setPaymentsPage(Math.max(1, paymentsPage - 1))}
            disabled={paymentsPage === 1}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {paymentsPage} of {Math.ceil(payments.length / 15)}
          </span>
          <button
            onClick={() => setPaymentsPage(paymentsPage + 1)}
            disabled={paymentsPage >= Math.ceil(payments.length / 15)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-6">
      {/* Reviews Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setReviewsTab("given")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${reviewsTab === "given" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}>
            Reviews Given
          </button>
          <button
            onClick={() => setReviewsTab("received")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${reviewsTab === "received" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}>
            Reviews Received
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{reviewsTab === "given" ? "Reviews Given to Providers" : "Reviews Received from Providers"}</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-md text-sm">
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {reviews
            .filter((review) => review.type === reviewsTab)
            .map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedReview(review)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={review.booking.service.image} alt={review.booking.service.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{review.booking.service.name}</h4>
                      <p className="text-sm text-gray-500">{review.booking.provider.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{review.comment}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {format(parseISO(review.date), "MMMM d, yyyy")}
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
                </div>
              </div>
            ))}
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setReviewsPage(Math.max(1, reviewsPage - 1))}
            disabled={reviewsPage === 1}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {reviewsPage} of {Math.ceil(reviews.length / 20)}
          </span>
          <button
            onClick={() => setReviewsPage(reviewsPage + 1)}
            disabled={reviewsPage >= Math.ceil(reviews.length / 20)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <span>{error}</span>
        </div>
      );
    }
    switch (activeTab) {
      case "bookings":
        return renderBookingsTab();
      case "payments":
        return renderPaymentsTab();
      case "reviews":
        return renderReviewsTab();
      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount Spent</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalSpent}</p>
                  </div>
                  <div className="bg-green-50 rounded-full p-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                  <button onClick={() => setActiveTab("bookings")} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {inProcessBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedBooking(booking)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={booking.service.image} alt={booking.service.name} className="h-16 w-16 rounded-lg object-cover" />
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{booking.service.name}</h4>
                          <p className="text-sm text-gray-500">{booking.provider.name}</p>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {format(parseISO(booking.date), "MMMM d, yyyy")}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
                  <button onClick={() => setActiveTab("reviews")} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedReview(review)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={review.booking.service.image} alt={review.booking.service.name} className="h-16 w-16 rounded-lg object-cover" />
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{review.booking.service.name}</h4>
                          <p className="text-sm text-gray-500">{review.booking.provider.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">My Dashboard</h2>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <a
                  href="/services"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Book New Service
                </a>
              </div>
            </div>

            <div className="mt-6">
              <nav className="flex space-x-4" aria-label="Tabs">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "bookings", label: "Bookings" },
                  { key: "payments", label: "Payments" },
                  { key: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${activeTab === tab.key ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-700"} px-3 py-2 font-medium text-sm rounded-md`}>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedBooking && renderBookingModal()}
      {selectedPayment && renderPaymentModal()}
      {selectedReview && renderReviewModal()}

      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform">
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this service and provider..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserDashboard;
