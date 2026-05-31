import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { BookingProvider } from "./contexts/bookingContext.jsx";
import { ServiceSearchProvider } from "./contexts/serviceSearchContext.jsx";
import { ThemeProvider } from "./contexts/themeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BookingProvider>
        <ServiceSearchProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ServiceSearchProvider>
      </BookingProvider>
    </AuthProvider>
  </StrictMode>
);
