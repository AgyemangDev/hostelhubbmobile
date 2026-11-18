// utils/referralShare.js
//
// One place for how a student's referral code is shared, so the profile,
// the referral screen and any banner say the same thing and use the same
// link. The link (hostelhubb.com/refer/CODE) opens the app and saves the
// code for the friend's next booking (see app/_layout + utils/links).
import { Linking, Platform, Share } from "react-native";
import { SITE_URL } from "./links";

export const referralLink = (code) => `${SITE_URL}/refer/${encodeURIComponent(code)}`;

export const referralMessage = (code) =>
  `I use HostelHubb for hostels, storage and Hubclip rooms. Use my code ${code} when you book: ${referralLink(code)}`;

/** System share sheet (it also has Copy on both platforms). */
export async function shareReferral(code) {
  try {
    await Share.share(
      Platform.OS === "ios"
        ? { message: referralMessage(code), url: referralLink(code) }
        : { message: referralMessage(code) }
    );
  } catch {}
}

/** Straight into WhatsApp; falls back to wa.me (opens WhatsApp or its web page). */
export async function shareReferralOnWhatsApp(code) {
  const text = encodeURIComponent(referralMessage(code));
  try {
    await Linking.openURL(`whatsapp://send?text=${text}`);
  } catch {
    try {
      await Linking.openURL(`https://wa.me/?text=${text}`);
    } catch {
      shareReferral(code);
    }
  }
}

/** Opens the Messages app with the invite filled in. */
export async function shareReferralBySms(code) {
  const body = encodeURIComponent(referralMessage(code));
  // iOS reads the body after "&", Android after "?".
  const url = Platform.OS === "ios" ? `sms:&body=${body}` : `sms:?body=${body}`;
  try {
    await Linking.openURL(url);
  } catch {
    shareReferral(code);
  }
}
