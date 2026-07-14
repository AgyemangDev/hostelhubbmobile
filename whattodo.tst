Good news / bad news here. Let me trace it end-to-end.
What's actually wired up
Android — mostly there. Your intentFilters block correctly declares an App Link for https://hostelhubb.com/hostel/* with autoVerify: true, plus the custom scheme hostelhubb://. That's the right shape.
iOS — missing entirely. There's no associatedDomains key under your ios config. Without it, tapping https://hostelhubb.com/hostel/123 in Safari will never open your app — it'll just load the website, no matter how the Android side is configured. Universal Links on iOS are a completely separate mechanism from Android App Links and need their own setup.
Custom scheme (hostelhubb://) — will work on both platforms if the app is already installed, but only when something explicitly navigates to that URL (e.g. your web banner's window.location = "hostelhubb://..."). On iOS specifically, Safari shows a system confirmation prompt the first time ("Open in HostelHubb?") — and if the app isn't installed, it just silently fails with no automatic fallback to the store. That's exactly the gap Universal Links solve, since they don't need a prompt and degrade gracefully to opening the webpage if the app isn't installed.
Fix 1 — Add iOS Universal Links
In app.json, under ios:
jsonc"ios": {
  "associatedDomains": ["applinks:hostelhubb.com"],
  "config": { ... },
  ...
}
Then host a file at https://hostelhubb.com/.well-known/apple-app-site-association (no file extension, served with Content-Type: application/json):
json{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.Hostelhubb.Hostelhubb",
        "paths": ["/hostel/*"]
      }
    ]
  }
}
Replace TEAMID with your actual Apple Developer Team ID (found in App Store Connect / Apple Developer portal — it's a 10-character alphanumeric string). Without this file hosted correctly, iOS will silently ignore the associatedDomains entitlement.
Fix 2 — Confirm Android App Links verification
Your intentFilters config is right, but autoVerify: true only actually works if Android can verify a matching file at https://hostelhubb.com/.well-known/assetlinks.json:
json[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.Hostelhubb.Hostelhubb",
      "sha256_cert_fingerprints": ["YOUR_APP_SIGNING_SHA256_FINGERPRINT"]
    }
  }
]
Get the fingerprint from eas credentials (Expo) or your Play Console's App Signing page. Without this hosted correctly, Android falls back to showing a disambiguation dialog ("Open with Chrome / HostelHubb?") instead of opening your app directly — not broken, just a worse experience.
Two bugs in your deep-linking code
Bug 1 — handleDeepLinking never returns the id, but the caller expects one.
In MainLayout:
jsconst onDeepLink = useCallback(async (event) => {
  const hostelId = await handleDeepLinking(event);
  if (hostelId) setDeepLinkHostelId(hostelId); // this never fires — always undefined
}, []);
But handleDeepLinking has no return statement — it navigates internally via router.push and ends there. So deepLinkHostelId state never gets set, which means checkUserAuthState (which reads deepLinkHostelId for post-login redirect handling) never has it available. If an unauthenticated user taps a deep link, gets sent to login, and logs in — they won't be redirected back to that hostel, because the id was never captured.
Bug 2 — param key mismatch.
jsrouter.push({
  pathname: "/(Details)/[id]",
  params: { hostelId: id },   // ← wrong key
});
Since the route file is [id].js (or [id].tsx), expo-router expects the dynamic segment to be read via useLocalSearchParams().id inside that screen — not .hostelId. Unless your Details screen was specifically written to read hostelId, this means the screen mounts with no id and likely shows a blank/error state.
Fixed deepLinking.js
jsimport { Linking } from "react-native";
import { router } from "expo-router";

export const handleDeepLinking = async (event) => {
  const url = event?.url;
  console.log("Received deep link:", url);

  if (!url) return null;

  try {
    let id = null;

    const cleanedUrl = url.startsWith("hostelhubb://")
      ? url.replace("hostelhubb://", "https://dummy/")
      : url;

    const urlObj = new URL(cleanedUrl);
    const pathParts = urlObj.pathname.split("/");

    if (pathParts[1] === "Details" && pathParts[2]) {
      id = pathParts[2];
    } else if (pathParts[1] === "hostel" && pathParts[2]) {
      id = pathParts[2];
    }

    if (id) {
      console.log("Navigating to /Details/" + id);
      router.push({
        pathname: "/(Details)/[id]",
        params: { id }, // fixed: matches the [id] dynamic segment
      });
    }

    return id; // fixed: caller can now capture this for auth-redirect logic
  } catch (error) {
    console.error("Error handling deep link:", error);
    return null;
  }
};

export const setupDeepLinkListeners = (customCallback) => {
  const onDeepLink = async (event) => {
    await handleDeepLinking(event);
    if (typeof customCallback === "function") {
      customCallback(event);
    }
  };

  const subscription = Linking.addEventListener("url", onDeepLink);

  Linking.getInitialURL().then((url) => {
    if (url) {
      onDeepLink({ url });
    }
  });

  return () => {
    subscription.remove();
  };
};
One more thing worth confirming while you're in there: your (Details)/[id].js screen — does it currently read useLocalSearchParams().hostelId anywhere? If so, that screen itself needs updating to .id too, or the fix above will break it in the opposite direction. Want me to check that file if you share it?