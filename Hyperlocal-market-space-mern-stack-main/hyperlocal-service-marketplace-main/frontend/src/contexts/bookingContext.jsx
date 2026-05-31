import { createContext, useContext, useState } from "react";
import { addHours } from "date-fns";

/* Create booking context */
const BookingContext = createContext();

/* Booking provider */
export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [step, setStep] = useState(1);

  const setService = (service) => {
    setCurrentBooking((prev) => ({
      ...prev,
      service,
    }));
  };

  const setDateTime = (date, time) => {
    setCurrentBooking((prev) => ({
      ...prev,
      date,
      time,
    }));
  };

  const setAddress = (address) => {
    setCurrentBooking((prev) => ({
      ...prev,
      address,
    }));
  };

  const setNotes = (notes) => {
    setCurrentBooking((prev) => ({
      ...prev,
      notes,
    }));
  };

  const setPaymentMethod = (method) => {
    setCurrentBooking((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const resetBooking = () => {
    setCurrentBooking(null);
    setStep(1);
  };

  const getAvailableTimeSlots = (selectedDate) => {
    const now = new Date();
    const minBookingTime = addHours(now, 2);
    const timeSlots = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const selectedDateTime = new Date(`${selectedDate}T${time}`);

        if (selectedDateTime > minBookingTime) {
          timeSlots.push(time);
        }
      }
    }

    return timeSlots;
  };

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        step,
        setService,
        setDateTime,
        setAddress,
        setNotes,
        setPaymentMethod,
        setStep,
        resetBooking,
        getAvailableTimeSlots,
      }}>
      {children}
    </BookingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);
