import React, { useState, useEffect } from "react";
import LocationMap from "../../components/maps/LocationMap.jsx";
import { format } from "date-fns";
import { useBooking } from "../../contexts/bookingContext.jsx";
import Layout from "../../components/layout/Layout.jsx";
import { Calendar, Clock, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { api } from "../../utils/api.js";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const BookingPage = () => {
  const { currentBooking, step, setDateTime, setAddress, setNotes, setPaymentMethod, setStep, getAvailableTimeSlots, setService, resetBooking } = useBooking();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddressState] = useState({
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [coordinates, setCoordinates] = useState({ lat: 40.7128, lng: -74.0060 });
  const [notes, setNotesState] = useState("");
  const [paymentMethod, setPaymentMethodState] = useState("stripe");

  // Set default query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const timeParam = params.get("time");
    if (dateParam) setSelectedDate(dateParam);
    if (timeParam) setSelectedTime(timeParam);
  }, []);

  // Initialize service from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("service");

    if (serviceId) {
      api.services.getById(serviceId).then((res) => {
        if (res.success && res.data) {
          setService(res.data);
        } else {
          window.location.href = "/services";
        }
      }).catch((err) => {
        console.error("Failed to fetch service for booking:", err);
        window.location.href = "/services";
      });
    } else {
      window.location.href = "/services";
    }
  }, [setService]);

  // Get next 30 days
  const getDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(format(date, "yyyy-MM-dd"));
    }

    return dates;
  };

  const handleDateTimeSelection = () => {
    if (selectedDate && selectedTime) {
      setDateTime(selectedDate, selectedTime);
      setStep(2);
    }
  };

  const handleAddressSubmission = () => {
    setAddress({
      ...address,
      coordinates: coordinates || undefined,
    });
    setNotes(notes);
    setStep(3);
  };

  const handlePaymentSelection = () => {
    setPaymentMethod(paymentMethod);
    setStep(4);
  };

  const handleBookingConfirmation = async () => {
    try {
      const timeParts = currentBooking.time.split(" ");
      let time24 = timeParts[0];
      if (timeParts[1] === "PM") {
        const hhmm = timeParts[0].split(":");
        let hour = parseInt(hhmm[0]);
        if (hour !== 12) hour += 12;
        time24 = `${hour}:${hhmm[1]}`;
      } else if (timeParts[1] === "AM") {
        const hhmm = timeParts[0].split(":");
        let hour = parseInt(hhmm[0]);
        if (hour === 12) hour = 0;
        time24 = `${hour.toString().padStart(2, "0")}:${hhmm[1]}`;
      }
      
      const scheduledTime = new Date(`${currentBooking.date}T${time24}:00`);

      const bookingData = {
        serviceId: currentBooking.service._id || currentBooking.service.id,
        scheduledTime: scheduledTime.toISOString(),
        address: {
          street: currentBooking.address.street,
          city: currentBooking.address.city,
          state: currentBooking.address.state,
          pincode: currentBooking.address.pincode,
          location: {
            type: "Point",
            coordinates: [
              currentBooking.address.coordinates?.lng || -74.0060,
              currentBooking.address.coordinates?.lat || 40.7128
            ]
          }
        },
        notes: currentBooking.notes || ""
      };

      const response = await api.bookings.create(bookingData);
      if (response.success) {
        alert("Booking created successfully and matched with nearest provider!");
        resetBooking();
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Booking confirmation failed:", error);
      alert(error.message || "No available provider for this service at the selected time/location");
    }
  };

  // Guard against undefined currentBooking.service
  if (!currentBooking?.service) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-600">Loading service details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Select Date & Time</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="grid grid-cols-4 gap-2">
                {getDates().map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 text-center border rounded-lg ${
                      selectedDate === date ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-gray-200 hover:border-indigo-600"
                    }`}>
                    {format(new Date(date), "MMM d")}
                  </button>
                ))}
              </div>
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {getAvailableTimeSlots(selectedDate).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-center border rounded-lg ${
                        selectedTime === time ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-gray-200 hover:border-indigo-600"
                      }`}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6">
              <button
                onClick={handleDateTimeSelection}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg disabled:bg-gray-300">
                Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Service Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddressState({ ...address, street: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <input
                  type="text"
                  value={address.area}
                  onChange={(e) => setAddressState({ ...address, area: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddressState({ ...address, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddressState({ ...address, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddressState({ ...address, pincode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="h-64 bg-gray-100 rounded-lg mb-4">
                {/* Google Maps Component */}
                <LocationMap />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotesState(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Any special instructions for the service provider..."
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleAddressSubmission}
                disabled={!address.street || !address.city || !address.pincode}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg disabled:bg-gray-300">
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>
            <div className="space-y-4">
              {[
                { id: "stripe", label: "Pay with Card", icon: CreditCard },
                { id: "razorpay", label: "Pay with Razorpay", icon: CreditCard },
                { id: "cash", label: "Cash on Service", icon: CreditCard },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`block p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === method.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-600"
                  }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethodState(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <method.icon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-6">
              <button onClick={handlePaymentSelection} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg">
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Booking Overview</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Service</h3>
                  <p className="text-lg text-gray-900">{currentBooking.service.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                  <p className="text-lg text-gray-900">
                    {format(new Date(currentBooking?.date || ""), "MMMM d, yyyy")} at {currentBooking?.time}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-lg text-gray-900">
                    {currentBooking?.address.street}, {currentBooking?.address.area}
                    <br />
                    {currentBooking?.address.city}, {currentBooking?.address.state} {currentBooking?.address.pincode}
                  </p>
                </div>
                {currentBooking?.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="text-lg text-gray-900">{currentBooking.notes}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                  <p className="text-lg text-gray-900">
                    {currentBooking?.paymentMethod === "stripe" ? "Credit Card" : currentBooking?.paymentMethod === "razorpay" ? "Razorpay" : "Cash on Service"}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">${currentBooking.service.basePrice || currentBooking.service.price}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleBookingConfirmation} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg">
              Confirm Booking
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {step > i ? <CheckCircle className="h-5 w-5" /> : <span>{i}</span>}
                  </div>
                  <div className={`ml-2 text-sm ${step >= i ? "text-indigo-600" : "text-gray-500"}`}>
                    {i === 1 ? "Date & Time" : i === 2 ? "Address" : i === 3 ? "Payment" : "Overview"}
                  </div>
                  {i < 4 && <div className={`h-0.5 w-16 mx-4 ${step > i ? "bg-indigo-600" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">{renderStep()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
