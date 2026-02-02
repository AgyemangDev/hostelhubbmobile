// File: utils/providers.jsx
import React from "react";
import { UserProvider } from "../context/UserContext";
import { HostelsProvider } from "../context/HostelsContext";
import { AccommodationProvider } from "../context/AccommodationContext";
import { AdminProvider } from "../context/ManagersContext";
import { BookingsProvider } from "../context/BookingsContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { TransactionProvider } from "../context/TransactionContext";
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
          <AdminProvider>
            <ReviewsProvider>
              <FavoritesProvider>
              <TransactionProvider>
                {children}
              </TransactionProvider>
              </FavoritesProvider>
            </ReviewsProvider>
          </AdminProvider>
        </BookingsProvider>
        </AccommodationProvider>
      </HostelsProvider>
    </UserProvider>
  );

  return ProvidersWrapper;
};