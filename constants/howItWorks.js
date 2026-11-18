// Copy for the "How HostelHubb works" screen. Edit the words here; the
// screen and its sections only lay them out.

export const HOW_IT_WORKS_HERO = {
  eyebrow: "HOW HOSTELHUBB WORKS",
  title: "Your campus life, sorted in one app",
  body: "Find a room, store your things over the break and travel home safely, all booked and paid for in HostelHubb.",
};

export const SERVICES = [
  {
    key: "rooms",
    label: "Rooms",
    icon: "bed-outline",
    title: "Find and secure a room",
    summary: "Browse verified hostels and homestels near your school, then lock in your room by paying in the app.",
    steps: [
      { icon: "search", title: "Browse rooms", subtitle: "Filter by school, area, room type and budget." },
      { icon: "calendar", title: "Send a booking", subtitle: "Pick a room type and payment option." },
      { icon: "notifications", title: "Manager confirms", subtitle: "The hostel checks a room is free for you." },
      { icon: "card", title: "Pay in the app", subtitle: "Your payment goes through HostelHubb, never a stranger." },
      { icon: "home", title: "Room secured", subtitle: "It's yours. No follow-up calls needed." },
    ],
    note: "Payment is what locks in your room. Once you've paid, it's confirmed.",
    cta: { label: "Browse rooms", route: "/(categories)/(hostels)" },
  },
  {
    key: "storage",
    label: "Storage",
    icon: "cube-outline",
    title: "Store your things over the break",
    summary: "Going home for a while? We collect your luggage, keep it safe and bring it back when school resumes.",
    steps: [
      { icon: "calendar", title: "Book a pickup", subtitle: "Choose your items and a pickup day." },
      { icon: "cube", title: "We collect", subtitle: "We pick up from your hostel or hall." },
      { icon: "lock-closed", title: "Stored safely", subtitle: "Your items are kept secure and tracked." },
      { icon: "location", title: "Delivered back", subtitle: "We bring them to you when school resumes." },
    ],
    note: "Not sure where you'll stay next term? Book now and add the delivery spot later.",
    cta: { label: "Book storage", route: "/(StorageForm)" },
  },
  {
    key: "transport",
    label: "Transport",
    icon: "bus-outline",
    title: "Travel between campus and home",
    summary: "Scheduled buses to designated cities, booked right from the app.",
    steps: [
      { icon: "map", title: "Pick your route", subtitle: "Campus to home, or home to campus." },
      { icon: "grid", title: "Choose a seat", subtitle: "See which seats are free and pick yours." },
      { icon: "card", title: "Pay in the app", subtitle: "Your ticket is issued straight away." },
      { icon: "bus", title: "Board and go", subtitle: "Show your ticket at departure." },
    ],
    note: "Routes run around the end of semester and short breaks, so book early.",
    cta: { label: "Find a bus", route: "/(categories)/(transport)" },
  },
];

export const WAYS_TO_EARN = [
  {
    icon: "videocam-outline",
    title: "HubClips: hand over your room",
    badge: "NEW",
    body: "Leaving campus? Film a short walkthrough of your room. Once it passes review, we find a student to take it over and you get your money back.",
    route: "/IntroductionScreen",
  },
  {
    icon: "people-outline",
    title: "Refer a hostel, earn every booking",
    body: "Refer a hostel owner to HostelHubb and earn every time a student books there. No cap, no expiry.",
    route: "/referralInfo",
  },
];

export const PROMISE = [
  { label: "OUR VISION", body: "A campus life where no student loses time worrying about a room, getting home, or storing their things." },
  { label: "OUR MISSION", body: "One trusted app that makes accommodation, storage and transport easy for every student." },
];
