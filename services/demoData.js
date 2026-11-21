// services/demoData.js — sample data for demo mode (constants/demo.js).
//
// One in-memory store, created when the app starts and reset when it restarts.
// Actions in the app change it the way the server would, and each change adds
// a notification, so the whole flow can be followed:
//
//   Room bookings
//     demo-room-pending   Waiting for the hostel, with a cancel timer and a
//                         "Remind hostel" button. Turns "accepted" 10 minutes
//                         after launch, with a notification.
//     demo-room-accepted  Accepted, awaiting payment. Sign the tenancy
//                         agreement, then pay (no money moves).
//     demo-room-paid      Paid, agreement signed by both sides. Report a
//                         problem, see the hostel's reply, rate the stay.
//   Storage orders        Awaiting pickup (confirm pickup), picked up
//                         (confirm delivery), delivered.
//   Bus tickets           A confirmed ticket, and an unpaid seat hold you can
//                         finish paying for.
import { Image } from "react-native";
import { auth } from "../lib/firebase/FirebaseConfig";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const started = Date.now();
const iso = (ms) => new Date(ms).toISOString();
const ymd = (ms) => iso(ms).slice(0, 10);
const asset = (mod) => Image.resolveAssetSource(mod)?.uri || null;
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => JSON.parse(JSON.stringify(value));

const studentName = () => auth.currentUser?.displayName?.trim() || "Ama Owusu";

const HOSTELS = {
  unity: {
    id: "demo-hostel-unity",
    accommodation_name: "Unity Heights Hostel",
    location: "Ayeduase, Kumasi",
    category: "hostel",
    front_image: asset(require("../assets/images/hostel.png")),
    manager: { first_name: "Kwame", surname: "Mensah" },
    rules: [
      "Quiet hours are from 10pm to 6am.",
      "Visitors must sign in at the porter's lodge and leave by 9pm.",
      "No cooking in the rooms. Use the shared kitchen on each floor.",
      "Keep your room and the shared spaces clean.",
      "Report faults, leaks and security concerns in the HostelHubb app straight away.",
    ],
  },
  royal: {
    id: "demo-hostel-royal",
    accommodation_name: "Ayeduase Royal Hostel",
    location: "Ayeduase, Kumasi",
    category: "hostel",
    front_image: asset(require("../assets/images/homstel.png")),
    manager: { first_name: "Abena", surname: "Owusu-Ansah" },
    rules: [],
  },
  evandy: {
    id: "demo-hostel-evandy",
    accommodation_name: "Evandy Guest House",
    location: "Bomso, Kumasi",
    category: "guest house",
    front_image: asset(require("../assets/images/guesthouse.png")),
    manager: { first_name: "Yaw", surname: "Boateng" },
    rules: [
      "Check-in is from 2pm on your move-in date.",
      "Overnight guests need the manager's permission.",
      "Smoking is not allowed anywhere on the property.",
      "Lost keys cost GHS 50 to replace.",
    ],
  },
};

const ROOM_LABELS = { OneInARoom: "1 in a room", TwoInARoom: "2 in a room", FourInARoom: "4 in a room" };
const longDate = (value) => (value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "to be confirmed");

function room(id, hostel, extra) {
  return {
    id,
    type: "accommodation",
    accommodation_id: hostel.id,
    accommodation_owner_id: `demo-owner-${hostel.id}`,
    accommodation: {
      id: hostel.id,
      accommodation_name: hostel.accommodation_name,
      front_image: hostel.front_image,
      location: hostel.location,
      category: hostel.category,
    },
    owner: hostel.manager,
    payment_status: false,
    payment_date: null,
    ...extra,
  };
}

// ── The store ──────────────────────────────────────────────────────────────
const store = {
  rooms: [
    room("demo-room-pending", HOSTELS.royal, {
      room_type: "FourInARoom",
      payment_option: "4200",
      status: "pending",
      lifecycle_status: null,
      response_due_at: iso(started + 5 * HOUR + 12 * MIN),
      booking_date: started - 3 * HOUR,
      bookingDate: started - 3 * HOUR,
      move_in_date: ymd(started + 21 * DAY),
      move_out_date: ymd(started + 140 * DAY),
    }),
    room("demo-room-accepted", HOSTELS.unity, {
      room_type: "TwoInARoom",
      payment_option: "6500",
      status: "accepted",
      lifecycle_status: "awaiting_payment",
      booking_date: started - 2 * DAY,
      bookingDate: started - 2 * DAY,
      action_date: iso(started - 20 * HOUR),
      acceptedDate: started - 20 * HOUR,
      payment_due_at: iso(started + 2 * DAY),
      move_in_date: ymd(started + 14 * DAY),
      move_out_date: ymd(started + 130 * DAY),
    }),
    room("demo-room-paid", HOSTELS.evandy, {
      room_type: "OneInARoom",
      payment_option: "9800",
      status: "accepted",
      lifecycle_status: "upcoming",
      payment_status: true,
      booking_date: started - 9 * DAY,
      bookingDate: started - 9 * DAY,
      action_date: iso(started - 8 * DAY),
      acceptedDate: started - 8 * DAY,
      payment_date: iso(started - 6 * DAY),
      move_in_date: ymd(started + 10 * DAY),
      move_out_date: ymd(started + 126 * DAY),
    }),
  ],
  agreements: {
    "demo-room-paid": { id: "TA-20931", signed_name: null, signed_at: iso(started - 6 * DAY - 10 * MIN) },
  },
  storage: [
    {
      id: "demo-storage-1",
      type: "storage",
      bookingReference: "HHS-48213",
      price: "185.00",
      pickup_status: "pending",
      delivery_status: "pending",
      order_date: iso(started - 1 * DAY),
      image_url: asset(require("../assets/images/storagebox.png")),
      items: [
        { id: 1, category: "Medium box", quantity: 2, unitPrice: 45, totalPrice: 90 },
        { id: 2, category: "Suitcase", quantity: 1, unitPrice: 55, totalPrice: 55 },
        { id: 3, category: "Mattress", quantity: 1, unitPrice: 40, totalPrice: 40 },
      ],
      pickup_info: { hostel: "Unity Heights Hostel", area: "Ayeduase", room: "B12", date: ymd(started + 2 * DAY) },
      delivery_info: { hostel: "Unity Heights Hostel", area: "Ayeduase", room: "B12", date: ymd(started + 60 * DAY) },
    },
    {
      id: "demo-storage-2",
      type: "storage",
      bookingReference: "HHS-47760",
      price: "120.00",
      pickup_status: "picked_up",
      delivery_status: "pending",
      order_date: iso(started - 40 * DAY),
      image_url: asset(require("../assets/images/storagebox.png")),
      items: [
        { id: 1, category: "Large box", quantity: 2, unitPrice: 60, totalPrice: 120 },
      ],
      pickup_info: { hostel: "Evandy Guest House", area: "Bomso", room: "4", date: ymd(started - 38 * DAY) },
      delivery_info: { hostel: "Evandy Guest House", area: "Bomso", room: "4", date: ymd(started + 1 * DAY) },
    },
    {
      id: "demo-storage-3",
      type: "storage",
      bookingReference: "HHS-41022",
      price: "75.00",
      pickup_status: "picked_up",
      delivery_status: "delivered",
      order_date: iso(started - 150 * DAY),
      image_url: asset(require("../assets/images/storagebox.png")),
      items: [{ id: 1, category: "Small box", quantity: 3, unitPrice: 25, totalPrice: 75 }],
      pickup_info: { hostel: "Brunei Hostel", area: "KNUST", room: "C7", date: ymd(started - 148 * DAY) },
      delivery_info: { hostel: "Unity Heights Hostel", area: "Ayeduase", room: "B12", date: ymd(started - 60 * DAY) },
    },
  ],
  transport: [
    {
      type: "transport",
      groupRef: "DEMO-GRP-7731",
      partnerRef: "UNG-7731-KMA",
      status: "success",
      from: "KNUST, Kumasi",
      to: "Circle, Accra",
      departureTime: new Date(started + 1 * DAY).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + ", 6:00 AM",
      seatNumbers: ["14"],
      seatCount: 1,
      total: 120,
      passenger: { name: "Ama Owusu", phone: "0241234567" },
      createdAt: iso(started - 2 * DAY),
    },
    {
      type: "transport",
      groupRef: "DEMO-GRP-8142",
      partnerRef: "UNG-8142-ACC",
      status: "pending",
      from: "Circle, Accra",
      to: "KNUST, Kumasi",
      departureTime: new Date(started + 5 * DAY).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) + ", 2:00 PM",
      seatNumbers: ["7", "8"],
      seatCount: 2,
      total: 240,
      passenger: { name: "Ama Owusu", phone: "0241234567" },
      createdAt: iso(started - 1 * MIN),
      expiresAt: iso(started + 30 * MIN),
      holdMinutes: 30,
    },
  ],
  notifications: [
    note("Booking accepted", "Unity Heights Hostel accepted your booking. Sign the agreement and pay before the deadline to secure your room.", "booking", "/bookings/accommodation/demo-room-accepted/pay", started - 20 * HOUR),
    note("Pickup scheduled", "We'll collect your 4 items from Unity Heights Hostel, room B12, in 2 days.", "storage", "/bookings/storage/demo-storage-1", started - 1 * DAY),
    note("Your ticket is ready", "KNUST to Circle, seat 14. Show the QR code when boarding.", "transport", "/transport/tickets/DEMO-GRP-7731", started - 2 * DAY, true),
    note("Payment received", "Your room at Evandy Guest House is secured. Move in from your move-in date.", "payment", "/bookings/accommodation/demo-room-paid", started - 6 * DAY, true),
  ],
  complaints: [
    {
      id: "demo-complaint-1",
      booking_id: "demo-room-paid",
      accommodation_name: "Evandy Guest House",
      category: "water",
      priority: "normal",
      title: "No water in the bathroom",
      description: "The tap in my bathroom has had no water since yesterday evening.",
      status: "in_progress",
      images: [],
      created_at: iso(started - 2 * DAY),
      last_activity_at: iso(started - 1 * DAY),
    },
  ],
  messages: {
    "demo-complaint-1": [
      { id: "m1", sender_type: "owner", status_change: "in_progress", body: null, created_at: iso(started - 1 * DAY - HOUR) },
      { id: "m2", sender_type: "owner", body: "Sorry about that. The plumber is coming tomorrow morning to fix the pump.", created_at: iso(started - 1 * DAY) },
    ],
  },
  reviews: [],
};

function note(title, body, category, url, at, read = false) {
  return { id: `demo-note-${Math.round(at)}-${title.length}`, title, body, category, created_at: iso(at), read_at: read ? iso(at) : null, data: { url } };
}
const notify = (title, body, category, url) => store.notifications.unshift(note(title, body, category, url, Date.now()));

// The pending booking is accepted 10 minutes after launch, so you can see a
// booking change state and the notification it sends.
function tick() {
  const pending = store.rooms.find((r) => r.id === "demo-room-pending");
  if (pending?.status === "pending" && Date.now() - started > 10 * MIN) {
    const now = Date.now();
    Object.assign(pending, {
      status: "accepted",
      lifecycle_status: "awaiting_payment",
      action_date: iso(now),
      acceptedDate: now,
      payment_due_at: iso(now + 3 * DAY),
    });
    notify("Booking accepted", "Ayeduase Royal Hostel accepted your booking. Sign the agreement and pay before the deadline to secure your room.", "booking", "/bookings/accommodation/demo-room-pending/pay");
  }
}

const hostelOf = (booking) => Object.values(HOSTELS).find((h) => h.id === booking.accommodation_id);

function agreementText(booking) {
  const hostel = hostelOf(booking);
  const rules = hostel.rules.length ? hostel.rules : [
    "Quiet hours are from 10pm to 6am.",
    "Visitors leave by 9pm unless the hostel agrees otherwise.",
    "Keep your room and shared spaces clean.",
  ];
  return [
    `Tenancy agreement for ${hostel.accommodation_name}`,
    "",
    `Resident: ${studentName()}`,
    `Room: ${ROOM_LABELS[booking.room_type] || booking.room_type}`,
    `Move in: ${longDate(booking.move_in_date)}`,
    `Move out: ${longDate(booking.move_out_date)}`,
    "",
    "1. Payment. The room is secured once full payment is made through HostelHubb. Payments made outside HostelHubb are not covered by HostelHubb.",
    "2. Use of the room. The room is for the resident named above. Subletting or moving others in needs the hostel's written permission.",
    "3. Care of property. The resident keeps the room and shared spaces in good condition and pays for damage they cause beyond normal wear.",
    "4. Conduct. The resident follows the hostel rules below and respects other residents, staff and neighbours.",
    "5. Problems. Maintenance issues and complaints are reported through the HostelHubb app so there is a record. The hostel aims to respond promptly.",
    "6. Leaving. The resident hands back keys and leaves the room clean by the move-out date.",
    "7. Cancellations and refunds follow HostelHubb's refund policy shown in the app at the time of booking.",
    "",
    "Hostel rules:",
    ...rules.map((r, i) => `${i + 1}. ${r}`),
    "",
    "Signatures",
    "The hostel signs this agreement electronically when its manager accepts the booking. The resident signs by typing their full name in the HostelHubb app. Both signatures, with the date and time, are recorded by HostelHubb, and either party can view the signed copy in the app.",
    "",
    "By signing, the resident confirms they have read this agreement and the hostel rules and agree to follow them.",
  ].join("\n");
}

function agreementView(bookingId) {
  const booking = store.rooms.find((r) => r.id === bookingId);
  if (!booking) throw Object.assign(new Error("Booking not found."), { status: 404 });
  const hostel = hostelOf(booking);
  const signed = store.agreements[bookingId];
  const hostelSigned = booking.status === "accepted" || booking.payment_status;
  return {
    accepted: Boolean(signed),
    agreement: { id: signed?.id, agreement_text: agreementText(booking), version: 2, accepted_at: signed?.signed_at || null, student_name: signed?.signed_name || null },
    parties: {
      hostel: {
        name: hostel.accommodation_name,
        signed_by: `${hostel.manager.first_name} ${hostel.manager.surname}`,
        signed_at: hostelSigned ? booking.action_date : null,
        signed: Boolean(hostelSigned),
      },
      student: {
        name: studentName(),
        signed_name: signed ? signed.signed_name || studentName() : null,
        signed_at: signed?.signed_at || null,
        signed: Boolean(signed),
      },
    },
  };
}

// ── Bookings (hooks and screens) ───────────────────────────────────────────
export const demoBookings = {
  rooms: async () => { tick(); await delay(); return copy(store.rooms); },
  room: async (id) => {
    tick();
    await delay(250);
    const booking = store.rooms.find((r) => r.id === id);
    if (!booking) throw new Error("Booking not found");
    return copy(booking);
  },
  /** Pretend payment: marks the room paid and sends the "payment received" update. */
  payRoom: async (id) => {
    await delay(900);
    const booking = store.rooms.find((r) => r.id === id);
    if (!booking) throw new Error("Booking not found");
    Object.assign(booking, { payment_status: true, payment_date: iso(Date.now()), lifecycle_status: "upcoming" });
    notify("Payment received", `Your room at ${booking.accommodation.accommodation_name} is secured. The signed tenancy agreement is in your booking.`, "payment", `/bookings/accommodation/${id}`);
  },

  storage: async () => { await delay(); return copy(store.storage); },
  /** "picked_up" or "delivered", as the storage card sends. */
  updateStorage: async (id, action) => {
    await delay(500);
    const order = store.storage.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    if (action === "picked_up") {
      order.pickup_status = "picked_up";
      notify("Items picked up", `We've collected your items for order ${order.bookingReference}. They're on the way to storage.`, "storage", `/bookings/storage/${id}`);
    }
    if (action === "delivered") {
      order.pickup_status = "picked_up";
      order.delivery_status = "delivered";
      notify("Items delivered", `Order ${order.bookingReference} is complete. Thanks for using HostelHubb Storage.`, "storage", `/bookings/storage/${id}`);
    }
    return { order: copy(order) };
  },

  transport: async () => { await delay(); return copy(store.transport); },
  trip: async (groupRef) => {
    await delay(300);
    const trip = store.transport.find((t) => t.groupRef === groupRef);
    if (!trip) throw Object.assign(new Error("Ticket not found"), { status: 404 });
    if (trip.status === "pending" && trip.expiresAt && Date.parse(trip.expiresAt) < Date.now()) trip.status = "expired";
    return copy(trip);
  },
  /** Pretend checkout for an unpaid seat hold. */
  payTrip: async (groupRef) => {
    await delay(900);
    const trip = store.transport.find((t) => t.groupRef === groupRef);
    if (!trip) throw new Error("Ticket not found");
    Object.assign(trip, { status: "success", expiresAt: null });
    notify("Your ticket is ready", `${trip.from} to ${trip.to}, seats ${trip.seatNumbers.join(", ")}. Show the QR code when boarding.`, "transport", `/transport/tickets/${groupRef}`);
  },
};

// ── /api/me (services/studentHub.js) ───────────────────────────────────────
const routes = [
  ["GET", /^\/api\/me\/notifications$/, () => { tick(); return { notifications: copy(store.notifications) }; }],
  ["GET", /^\/api\/me\/notifications\/unread-count$/, () => ({ unread: store.notifications.filter((n) => !n.read_at).length })],
  ["PATCH", /^\/api\/me\/notifications\/([^/]+)\/read$/, ([id]) => {
    const n = store.notifications.find((x) => x.id === id);
    if (n && !n.read_at) n.read_at = iso(Date.now());
    return { ok: true };
  }],
  ["POST", /^\/api\/me\/notifications\/read-all$/, () => {
    store.notifications.forEach((n) => { n.read_at = n.read_at || iso(Date.now()); });
    return { ok: true };
  }],

  ["POST", /^\/api\/me\/bookings\/([^/]+)\/remind-hostel$/, ([id]) => {
    const booking = store.rooms.find((r) => r.id === id);
    if (!booking || booking.status !== "pending") throw Object.assign(new Error("The hostel has already replied to this booking."), { status: 400 });
    if (booking.reminded_until && booking.reminded_until > Date.now()) {
      throw Object.assign(new Error("You reminded the hostel recently. You can send another reminder later."), { status: 429, code: "REMINDED_RECENTLY" });
    }
    booking.reminded_until = Date.now() + 3 * HOUR;
    notify("Reminder sent to the hostel", `We asked ${booking.accommodation.accommodation_name} to reply to your booking.`, "booking", "/bookings");
    return { reminded: true, next_at: iso(booking.reminded_until) };
  }],
  ["GET", /^\/api\/me\/bookings\/([^/]+)\/agreement$/, ([id]) => agreementView(id)],
  ["POST", /^\/api\/me\/bookings\/([^/]+)\/agreement$/, ([id], body) => {
    const booking = store.rooms.find((r) => r.id === id);
    if (!booking || booking.status !== "accepted") throw Object.assign(new Error("You can sign the agreement once the hostel accepts your booking."), { status: 400 });
    if (!store.agreements[id]) {
      const signature = String(body?.signature || "").replace(/\s+/g, " ").trim();
      if (signature.length < 3) throw Object.assign(new Error("Type your full name to sign."), { status: 400 });
      store.agreements[id] = { id: `TA-${Math.floor(20000 + Math.random() * 9999)}`, signed_name: signature, signed_at: iso(Date.now()) };
      notify("Agreement signed", `You and ${booking.accommodation.accommodation_name} have both signed the tenancy agreement. Pay to secure your room.`, "booking", `/bookings/accommodation/${id}/pay`);
    }
    return agreementView(id);
  }],

  ["GET", /^\/api\/me\/reviews$/, () => ({ reviews: copy(store.reviews) })],
  ["POST", /^\/api\/me\/reviews$/, (_, body) => {
    const review = { id: `demo-review-${body.booking_id}`, booking_id: body.booking_id, rating: body.rating, comment: body.comment, owner_reply: null, created_at: iso(Date.now()) };
    store.reviews = [review, ...store.reviews.filter((r) => r.booking_id !== body.booking_id)];
    return { review };
  }],

  ["GET", /^\/api\/me\/complaints$/, () => ({ complaints: copy(store.complaints) })],
  ["GET", /^\/api\/me\/complaints\/([^/]+)$/, ([id]) => {
    const complaint = store.complaints.find((c) => c.id === id);
    if (!complaint) throw Object.assign(new Error("Complaint not found."), { status: 404 });
    return { complaint: copy(complaint), messages: copy(store.messages[id] || []) };
  }],
  ["POST", /^\/api\/me\/complaints$/, (_, body) => {
    const booking = store.rooms.find((r) => r.id === body.booking_id);
    const complaint = {
      id: `demo-complaint-${Date.now()}`,
      booking_id: body.booking_id,
      accommodation_name: booking?.accommodation.accommodation_name || "Your hostel",
      category: body.category,
      priority: body.priority || "normal",
      title: body.title,
      description: body.description,
      status: "open",
      images: body.images || [],
      created_at: iso(Date.now()),
      last_activity_at: iso(Date.now()),
    };
    store.complaints.unshift(complaint);
    store.messages[complaint.id] = [];
    // The hostel answers a little later, as a real manager would.
    setTimeout(() => {
      store.messages[complaint.id].push({ id: `r-${Date.now()}`, sender_type: "owner", body: "Thanks for letting us know. We're looking into it today.", created_at: iso(Date.now()) });
      complaint.status = "in_progress";
      complaint.last_activity_at = iso(Date.now());
      notify("The hostel replied", `${complaint.accommodation_name}: "Thanks for letting us know. We're looking into it today."`, "complaint", `/complaints/${complaint.id}`);
    }, 45 * 1000);
    return { complaint: copy(complaint) };
  }],
  ["POST", /^\/api\/me\/complaints\/([^/]+)\/messages$/, ([id], body) => {
    const complaint = store.complaints.find((c) => c.id === id);
    if (!complaint) throw Object.assign(new Error("Complaint not found."), { status: 404 });
    if (["resolved", "dismissed"].includes(complaint.status)) complaint.status = "open";
    const message = { id: `s-${Date.now()}`, sender_type: "student", body: body.body, created_at: iso(Date.now()) };
    (store.messages[id] = store.messages[id] || []).push(message);
    complaint.last_activity_at = message.created_at;
    return { message, status: complaint.status };
  }],

  ["GET", /^\/api\/me\/waitlist$/, () => ({ entries: [] })],
];

/**
 * Answers a studentHub request from the demo store, or returns undefined so
 * the real server is called (public endpoints like hostel reviews).
 */
export async function demoHub(path, { method = "GET", body } = {}) {
  for (const [verb, re, handler] of routes) {
    const match = verb === method && path.match(re);
    if (match) {
      await delay(300);
      return handler(match.slice(1).map(decodeURIComponent), body);
    }
  }
  return undefined;
}
