// In-app announcements shown on the Notifications screen, most important
// first. `tone` picks the icon tile colour (see NotificationIcon):
//   warning (safety), info (news), brand (offers / earning).
// Put links in `action`, not in the message, so they render as a button.

export const ANNOUNCEMENTS = [
  {
    id: "3",
    tone: "warning",
    icon: "shield-checkmark-outline",
    title: "Scam alert: stay protected",
    message:
      "Don't pay people you meet in WhatsApp groups. Many students have lost money to fake agents. Only book and pay through HostelHubb.",
    time: "Today",
  },
  {
    id: "5",
    tone: "warning",
    icon: "card-outline",
    title: "Always pay through official channels",
    message:
      "To secure your booking, pay in the app directly to the hostel manager or into our bank account: NAG HOSTELHUBB, GT Bank, 3302001049665. Contact HostelHubb if you're unsure.",
    time: "Today",
  },
  {
    id: "1",
    tone: "info",
    icon: "megaphone-outline",
    title: "Join our WhatsApp channel",
    message: "Be the first to hear about new hostels, exclusive offers and important updates.",
    action: { label: "Join the channel", icon: "logo-whatsapp", url: "https://www.whatsapp.com/channel/0029VavI8Yv5fM5e7ydw7i1W" },
    time: "Just now",
  },
  {
    id: "7",
    tone: "brand",
    icon: "cash-outline",
    title: "Earn with every referral",
    message:
      "Share your referral code from your profile. When friends book storage, transport or a hostel through HostelHubb, you earn a share of the booking. They never pay extra.",
    action: { label: "See my referral code", icon: "people-outline", route: "/referralInfo" },
    time: "Today",
  },
  {
    id: "6",
    tone: "brand",
    icon: "business-outline",
    title: "HostelHubb could pay your fees",
    message:
      "Know a hostel that isn't on HostelHubb yet? Tell the manager about HostelHubb Manager, a free tool to list and run the hostel, and earn every time someone books through the app.",
    time: "Today",
  },
];
