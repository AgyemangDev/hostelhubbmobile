// File: utils/providers.jsx
import React from "react";
import { UserProvider } from "../context/UserContext";
import { HostelsProvider } from "../context/HostelsContext";
import { AccommodationProvider } from "../context/AccommodationContext";
import { BookingsProvider } from "../context/BookingsContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { FavoritesProvider } from "../context/FavoritesContext";



/**
 * Utility function to set up all providers in the correct nesting order
 * @returns {Function} A component that wraps children with all required providers
 */
export const setupProviders = () => {
  // Creates a component that applies all providers in the correct nesting order
  const ProvidersWrapper = ({ children }) => (
    <UserProvider>
      <HostelsProvider>
        <AccommodationProvider>
        <BookingsProvider>
            <ReviewsProvider>
              <FavoritesProvider>

                {children}

              </FavoritesProvider>
            </ReviewsProvider>
        </BookingsProvider>
        </AccommodationProvider>
      </HostelsProvider>
    </UserProvider>
  );

  return ProvidersWrapper;
};