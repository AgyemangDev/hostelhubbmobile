import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import API_BASE_URL from "../utils/api/api";
import { UserContext } from "./UserContext";
import { useAuthedEventSource } from "../hooks/realtime/useAuthedEventSource";

export const TransactionContext = createContext();

const PAGE_SIZE = 10;

const mergeUniqueById = (prev, next) => {
  const map = new Map();
  [...prev, ...next].forEach((item) => {
    map.set(item.id, item);
  });
  return Array.from(map.values());
};

export const TransactionProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  /* ------------------ Fetch Transactions ------------------ */

const fetchTransactions = useCallback(
  async ({ reset = false } = {}) => {
    if (!user) return;

    try {
      if (!initialized) {
        setLoading(true); // force initial loading
      } else if (reset) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoading(true);
      }

      const token = await user.getIdToken(false);
      const currentPage = reset ? 1 : page;

      const response = await fetch(
        `${API_BASE_URL}/api/transactions?page=${currentPage}&limit=${PAGE_SIZE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

 setTransactions((prev) =>
  reset
    ? data.transactions
    : mergeUniqueById(prev, data.transactions)
);

      setTotalPages(data.totalPages);
      setPage(currentPage + 1);
      setError(null);
      setInitialized(true); // ✅ mark first fetch done
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [user, page, initialized]
);
  /* ------------------ Helpers ------------------ */

  const refreshTransactions = useCallback(() => {
    fetchTransactions({ reset: true });
  }, [fetchTransactions]);

  const loadMoreTransactions = useCallback(() => {
    if (!loading && page <= totalPages) {
      fetchTransactions();
    }
  }, [fetchTransactions, loading, page, totalPages]);

  const isInitialLoading = !initialized && loading;

  /* ------------------ Push updates ------------------ */
  // Upsert newly-pushed transactions (e.g. a payment that just completed)
  // straight into page-1 state, using the same de-dupe helper the paginated
  // fetch already relies on. Falls back to a full reset-refetch if the app
  // was backgrounded and might have missed a push.
  useAuthedEventSource(
    "/api/transactions/stream",
    (payload) => {
      setTransactions((prev) => mergeUniqueById(prev, [payload]));
    },
    refreshTransactions
  );

  /* ------------------ Context Value ------------------ */

const value = useMemo(
  () => ({
    transactions,
    loading,
    refreshing,
    error,
    fetchTransactions,
    refreshTransactions,
    loadMoreTransactions,
    hasMore: page <= totalPages,
    isInitialLoading,
  }),
  [
    transactions,
    loading,
    refreshing,
    error,
    fetchTransactions,
    refreshTransactions,
    loadMoreTransactions,
    page,
    totalPages,
    isInitialLoading,
  ]
);

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
