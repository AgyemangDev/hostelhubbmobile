import { useCallback, useContext, useRef, useState } from "react";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { UserContext } from "../context/UserContext";
import { TransactionContext } from "../context/TransactionContext";
import { confirmPayment as checkPaymentStatus } from "../services/paymentService";

/**
 * Deep link Paystack should redirect back to once checkout completes.
 *
 * NOTE: this must match whatever `callback_url` the backend sets when it
 * calls Paystack's initialize-transaction API for
 * `POST /api/payments/initiate`. That wiring is being done by a different
 * agent in parallel and wasn't confirmed at the time this was written —
 * confirm the real value against the finished backend / Paystack dashboard
 * config and update this constant if it differs.
 */
export const PAYMENT_RETURN_SCHEME = "hostelhubb://payments/callback";

/** Paystack's webhook can trail the user's return; poll briefly before giving up. */
const CONFIRM_ATTEMPTS = 6;
const CONFIRM_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Direct-Paystack payment confirmation, mirroring
 * `hooks/transport/useResumePayment.jsx`'s shape for the new
 * storage/accommodation/hubclip payment flow.
 *
 * The checkout sheet closing is NOT proof of payment, so this always polls
 * the backend's status endpoint with a bounded number of attempts. The
 * transactions SSE stream (pushed into `TransactionContext`) is also watched
 * as an optimization: if a transaction matching `reference` arrives while
 * polling, that's treated as an early-exit success signal — but per design,
 * the poll's own bound remains the sole source of truth for failure/timeout;
 * the stream is never the only way this can resolve.
 */
export function usePaymentConfirmation() {
  const { user } = useContext(UserContext);
  const { transactions } = useContext(TransactionContext) || {};

  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  // Kept fresh every render so the polling loop below (which lives across
  // renders inside a single async call) always sees the latest pushed rows.
  const transactionsRef = useRef(transactions);
  transactionsRef.current = transactions;

  const confirm = useCallback(
    async ({ authorization_url, reference }, { onDone } = {}) => {
      if (!authorization_url || !reference || inFlight.current) return "error";
      inFlight.current = true;
      setBusy(true);

      const matchesReference = (t) =>
        (t?.reference === reference || t?.transactionReference === reference) &&
        (t?.status === "completed" || t?.status === "success");

      try {
        // openAuthSessionAsync keeps the sheet inside the app and resolves as
        // soon as our return scheme is hit — or when the user dismisses it.
        await WebBrowser.openAuthSessionAsync(authorization_url, PAYMENT_RETURN_SCHEME);

        for (let attempt = 0; attempt < CONFIRM_ATTEMPTS; attempt += 1) {
          // Early exit: the transactions stream may already have pushed the
          // completed row before this poll iteration runs.
          if (transactionsRef.current?.some(matchesReference)) {
            onDone?.("success");
            return "success";
          }

          const status = await checkPaymentStatus({ user, reference });

          if (status.status === "completed") {
            onDone?.("success");
            return "success";
          }
          if (status.status === "failed") {
            Alert.alert("Payment failed", "That payment did not go through. You can try again.");
            onDone?.("failed");
            return "failed";
          }
          if (attempt < CONFIRM_ATTEMPTS - 1) await sleep(CONFIRM_DELAY_MS);
        }

        // Still pending: the money may yet land, so never imply failure.
        Alert.alert(
          "Still confirming",
          "We haven't had confirmation from the payment provider yet. If you completed payment, it will reflect shortly — you have not been charged twice."
        );
        onDone?.("pending");
        return "pending";
      } catch (err) {
        Alert.alert("Could not confirm payment", err.message);
        onDone?.("error");
        return "error";
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [user]
  );

  return { confirm, busy };
}
