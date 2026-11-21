// What a shared hostel or hubclip says. The link goes inside the message
// (never as a separate `url`): with both, iOS copies them packed into one
// unreadable blob instead of plain text.
//
//   Pinamang Hostel on HostelHubb
//   Hostel in Ayeduase, KNUST · from GH₵5,460 a year
//   See rooms and book: https://hostelhubb.com/hostels/pinamang-hostel
import { listingFacts, listingPlace } from "./listingFacts";
import roomLabel from "./roomLabel";
import { money } from "./formatMoney";

const FEE_RATE = 0.05;
const priceText = (n) => money(n, { decimals: 0 });

/** { title, message } for Share.share. */
export function hostelShare(hostel = {}, link) {
  const name = hostel.accommodation_name || "This hostel";
  const facts = listingFacts(hostel);
  const details = [listingPlace(hostel), facts.fromPrice ? `from ${priceText(facts.fromPrice)} a year` : null].filter(Boolean).join(" · ");
  return {
    title: `${name} on HostelHubb`,
    message: [`${name} on HostelHubb`, details, `See rooms and book: ${link}`].filter(Boolean).join("\n"),
  };
}

/** { title, message } for Share.share, from a hubclip row. */
export function clipShare(clip = {}, link) {
  const name = clip.hostel_name || "A room";
  const area = String(clip.location || "").split(",")[0].trim();
  const where = [area, clip.institution].filter(Boolean).join(", ");
  const room = roomLabel(clip.room_type);
  const price = Number(clip.price) ? `${priceText(Number(clip.price) * (1 + FEE_RATE))} a year` : null;
  const details = [[room, where].filter(Boolean).join(" in "), price].filter(Boolean).join(" · ");
  return {
    title: `${name} on HostelHubb`,
    message: [`${name} on HostelHubb`, details, `Watch the video tour: ${link}`].filter(Boolean).join("\n"),
  };
}
