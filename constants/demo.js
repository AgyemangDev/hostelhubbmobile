// Demo mode: sample room bookings, storage orders, bus tickets, a tenancy
// agreement to sign, complaints and notifications in place of the student's
// real data, so each step can be followed without real bookings or payments.
//
// Turn on locally only, by adding EXPO_PUBLIC_DEMO=1 to .env.local (which is
// gitignored) and restarting Expo with `npx expo start -c`. It is off unless
// that variable is set, and store builds never set it (eas.json doesn't).
// Sign in with any account; the sample data replaces what that account sees.
// __DEV__ keeps it out of release bundles even if `eas update` runs with
// .env.local present, since updates are bundled on this machine.
export const DEMO = __DEV__ && process.env.EXPO_PUBLIC_DEMO === "1";
