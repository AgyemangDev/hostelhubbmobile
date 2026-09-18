// File: utils/providers.jsx
import React from "react";
import { UserProvider } from "../context/UserContext";
import { WalletProvider } from "../context/WalletContext";
import { TransactionProvider } from "../context/TransactionContext";
import { AccommodationProvider } from "../context/AccommodationContext";
import { BookingsProvider } from "../context/BookingsContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { FavoritesProvider } from "../context/FavoritesContext";



/**
 * Utility function to set up all providers in the correct nesting order
 * @returns {Function} A component that wraps children with all required providers
 *
 * `WalletProvider` and `TransactionProvider` live here (not scoped to a
 * single stack) so their SSE connections are persistent for the whole app
 * session and so `usePaymentConfirmation`'s early-exit-on-matching-transaction
 * check works from any payment entry point (storage, accommodation, etc.),
 * not just the Profile screens.
 */
export const setupProviders = () => {
  // Creates a component that applies all providers in the correct nesting order
  const ProvidersWrapper = ({ children }) => (
    <UserProvider>
      <WalletProvider>
        <TransactionProvider>
          <AccommodationProvider>
            <BookingsProvider>
              <ReviewsProvider>
                <FavoritesProvider>

                  {children}

                </FavoritesProvider>
              </ReviewsProvider>
            </BookingsProvider>
          </AccommodationProvider>
        </TransactionProvider>
      </WalletProvider>
    </UserProvider>
  );

  return ProvidersWrapper;
};