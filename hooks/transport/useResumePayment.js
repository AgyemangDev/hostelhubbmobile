import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { startPayment, getBooking, TRANSPORT_RETURN_SCHEME } from "../../utils/api/unigo";

/**
 * Reopen Hubtel checkout for a booking that was never paid for.
 *
 * Payments get cut off constantly — network drops mid-MoMo, the app is killed,
 * the sheet is dismissed by accident. Without this the seat is simply lost and
 * the student has to search and pick it all over again.
 *
 * The seat is only held for a few minutes, so resuming is not guaranteed: UniGo
 * re-acquires the hold and returns 409 if someone else has since taken the seat.
 * That case is surfaced plainly rather than dumped as a raw error.
 */

const CONFIRM_ATTEMPTS = 6;
const CONFIRM_DELAY_MS = 2000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useResumePayment() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  const resume = useCallback(
    async (groupRef, { onDone } = {}) => {
      if (!groupRef || inFlight.current) return;
      inFlight.current = true;
      setBusy(true);

      try {
        const payment = await startPayment(groupRef);
        const checkoutUrl = payment.checkoutDirectUrl || payment.checkoutUrl;
        if (!checkoutUrl) throw new Error("The payment provider did not return a checkout page.");

        await WebBrowser.openAuthSessionAsync(checkoutUrl, TRANSPORT_RETURN_SCHEME);

        // The sheet closing proves nothing — the user may have cancelled.
        for (let attempt = 0; attempt < CONFIRM_ATTEMPTS; attempt += 1) {
          const status = await getBooking(groupRef, { fresh: true });

          if (status.status === "success") {
            onDone?.("success");
            router.push({
              pathname: "/(categories)/(transport)/Ticket",
              params: { groupRef, justPaid: "1" },
            });
            return;
          }
          if (status.status === "failed") {
            Alert.alert("Payment failed", "That payment did not go through. You can try again.");
            onDone?.("failed");
            return;
          }
          if (attempt < CONFIRM_ATTEMPTS - 1) await sleep(CONFIRM_DELAY_MS);
        }

        Alert.alert(
          "Still confirming",
          "We haven't had confirmation from the payment provider yet. If you completed payment, your ticket will appear here shortly — you have not been charged twice."
        );
        onDone?.("pending");
      } catch (err) {
        // 409 from UniGo means the seat went to someone else while this checkout
        // was abandoned — the one outcome the user genuinely cannot retry past.
        const seatGone = err?.status === 409;
        Alert.alert(
          seatGone ? "Seat no longer available" : "Could not resume payment",
          seatGone
            ? `${err.message} You'll need to book again and pick another seat.`
            : err.message
        );
        onDone?.(seatGone ? "seat_taken" : "error");
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [router]
  );

  return { resume, busy };
}
