import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "./contexts/authContext.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetails from "./pages/ServiceDetails.jsx";
import CategoryPage from "./pages/categories/CategoryPage.jsx";
import BookingPage from "./pages/booking/BookingPage.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import UserDashboard from "./pages/dashboard/UserDashboard.jsx";
import ProviderDashboard from "./pages/dashboard/ProviderDashboard.jsx";
import BecomeProvider from "./pages/BecomeProvider.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// Wrapper for protected routes
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Dashboard router switcher
const DashboardRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return (
        <ProtectedRoute roles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      );
    case "provider":
      return (
        <ProtectedRoute roles={["provider"]}>
          <ProviderDashboard />
        </ProtectedRoute>
      );
    default:
      return (
        <ProtectedRoute roles={["user"]}>
          <UserDashboard />
        </ProtectedRoute>
      );
  }
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect provider to dashboard if logged in
  useEffect(() => {
    if (isAuthenticated && user?.role === "provider" && location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/categories/:id" element={<CategoryPage />} />
      <Route
        path="/booking"
        element={
          <ProtectedRoute roles={["user"]}>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute roles={["user"]}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/become-provider" element={<BecomeProvider />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
