import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import API_BASE_URL from "../utils/api/api";
import { UserContext } from "./UserContext";
import { useAuthedEventSource } from "../hooks/realtime/useAuthedEventSource";

export const WalletContext = createContext();

/**
 * Wallet balance, kept separate from `UserContext`.
 *
 * The wallet now lives behind its own table/stream on the backend, and a
 * balance tick shouldn't re-render every consumer of the general user object
 * — so this is its own context rather than a field merged into `userInfo`.
 */
export const WalletProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Bootstrap value ───────────────────────────────────────────────────────
  // Reads wallet_balances (via GET /api/wallet), not Student_Users.balance —
  // that column is frozen post-migration and would go stale immediately.
  const fetchBalance = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const token = await user.getIdToken(false);
      const response = await fetch(`${API_BASE_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setBalance(Number(data?.balance) || 0);
      setError(null);
    } catch (err) {
      console.error("[WalletContext] fetchBalance error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance();
    } else {
      setBalance(0);
      setIsLoading(false);
    }
  }, [user, fetchBalance]);

  // Pushed balance updates. `fetchBalance` is also handed in as the
  // one-time catch-up refetch fired after the app was backgrounded.
  useAuthedEventSource(
    "/api/wallet/stream",
    (payload) => {
      if (payload?.balance !== undefined) {
        setBalance(Number(payload.balance) || 0);
      }
    },
    fetchBalance
  );

  const value = useMemo(
    () => ({ balance, isLoading, error, refetchBalance: fetchBalance }),
    [balance, isLoading, error, fetchBalance]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
