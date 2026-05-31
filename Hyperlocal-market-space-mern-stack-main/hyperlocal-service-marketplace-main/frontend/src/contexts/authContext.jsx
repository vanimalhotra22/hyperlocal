import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api.js";

/* Create context */
const AuthContext = createContext();

/* Auth provider */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const authUser = localStorage.getItem("auth-user");
    return authUser ? JSON.parse(authUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const response = await api.auth.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem("auth-user", JSON.stringify(response.data));
          } else {
            handleLogoutState();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          handleLogoutState();
        }
      } else {
        handleLogoutState();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogoutState = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
  };

  // Login method to set user and token in state and storage
  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("auth-token", token);
    }
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("auth-user", JSON.stringify(userData));
  };

  // Logout method, remove user from localstorage
  const logout = () => {
    handleLogoutState();
  };

  const updateProviderStatus = (userId, status) => {
    if (user && (user.id === userId || user._id === userId)) {
      const updatedUser = { ...user, providerStatus: status };
      setUser(updatedUser);
      localStorage.setItem("auth-user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateProviderStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

/* Hook to use auth state */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);