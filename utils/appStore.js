import { Linking, Platform } from "react-native";
import * as Application from "expo-application";

const IOS_APP_ID = "6738483533";
const ANDROID_PACKAGE = "com.Hostelhubb.Hostelhubb";

/** This install's native build number (iOS build number / Android versionCode), or null. */
export function currentBuild() {
  const n = Number(Application.nativeBuildVersion);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** e.g. "4.1.0 (45)": shown in Profile so support can ask which build someone has. */
export function versionLabel() {
  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;
  if (!version) return null;
  return build ? `${version} (${build})` : version;
}

/** Opens HostelHubb's page in the App Store or Play Store. */
export async function openStoreListing() {
  if (Platform.OS === "ios") {
    return Linking.openURL(`https://apps.apple.com/app/id${IOS_APP_ID}`);
  }
  try {
    await Linking.openURL(`market://details?id=${ANDROID_PACKAGE}`);
  } catch {
    // No Play Store app (rare): fall back to the website.
    await Linking.openURL(`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`);
  }
}
