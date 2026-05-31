const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("auth-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    googleLogin: async (credential) => {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ credential }),
      });
      return handleResponse(response);
    },
    getMe: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Services API
  services: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/service`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getGrouped: async () => {
      const response = await fetch(`${API_BASE_URL}/service/grouped`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/service/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    create: async (serviceData) => {
      const response = await fetch(`${API_BASE_URL}/service`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(serviceData),
      });
      return handleResponse(response);
    },
    update: async (id, serviceData) => {
      const response = await fetch(`${API_BASE_URL}/service/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(serviceData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/service/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Bookings API
  bookings: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/booking`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getUserBookings: async () => {
      const response = await fetch(`${API_BASE_URL}/booking/user`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getProviderBookings: async () => {
      const response = await fetch(`${API_BASE_URL}/booking/provider`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/booking/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    create: async (bookingData) => {
      const response = await fetch(`${API_BASE_URL}/booking`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    },
    updateStatus: async (id, status, durationMinutes) => {
      const response = await fetch(`${API_BASE_URL}/booking/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status, durationMinutes }),
      });
      return handleResponse(response);
    },
  },

  // Reviews API
  reviews: {
    create: async (reviewData) => {
      const response = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });
      return handleResponse(response);
    },
    getBookingReview: async (bookingId) => {
      const response = await fetch(`${API_BASE_URL}/review/booking/${bookingId}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getMyReviews: async () => {
      const response = await fetch(`${API_BASE_URL}/review/my-reviews`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // User and Provider Profiles API
  users: {
    getProfile: async (id) => {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    updateProfile: async (profileData) => {
      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(response);
    },
    getAllProviders: async () => {
      const response = await fetch(`${API_BASE_URL}/user/all-providers`, {
        method: "GET",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    verifyProvider: async (id, isVerified) => {
      const response = await fetch(`${API_BASE_URL}/user/providers/${id}/verify`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ isVerified }),
      });
      return handleResponse(response);
    },
    addAddress: async (addressData) => {
      const response = await fetch(`${API_BASE_URL}/user/address`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(addressData),
      });
      return handleResponse(response);
    },
    deleteAddress: async (id) => {
      const response = await fetch(`${API_BASE_URL}/user/address/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },
};
