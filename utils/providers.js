// File: utils/providers.jsx
import React from "react";
import { UserProvider } from "../context/UserContext";
import { HostelsProvider } from "../context/HostelsContext";
import { AdminProvider } from "../context/ManagersContext";
import { BookingsProvider } from "../context/BookingsContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { TransactionProvider } from "../context/TransactionContext";
import { StarredHostelsProvider } from "../context/StarredHostelsContext";

/**
 * Utility function to set up all providers in the correct nesting order
 * @returns {Function} A component that wraps children with all required providers
 */
export const setupProviders = () => {
  // Creates a component that applies all providers in the correct nesting order
  const ProvidersWrapper = ({ children }) => (
    <UserProvider>
      <HostelsProvider>
        <BookingsProvider>
          <AdminProvider>
            <ReviewsProvider>
              <StarredHostelsProvider>
              <TransactionProvider>
                {children}
              </TransactionProvider>
              </StarredHostelsProvider>
            </ReviewsProvider>
          </AdminProvider>
        </BookingsProvider>
      </HostelsProvider>
    </UserProvider>
  );

  return ProvidersWrapper;
};