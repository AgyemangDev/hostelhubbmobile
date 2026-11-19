# Hostelhubb

## OTA Updates (JS only — no native changes)
eas update --branch production --message "update on storage delivery information" --platform ios


# Always push both platforms together (no --platform flag)

## Native Builds (when you change native code, version, or permissions)
# iOS (builds + auto submits to App Store)
eas build --platform ios --profile production --non-interactive --auto-submit

## set eas build version
eas build:version:set

# Android AAB (Google Play)
eas build --platform android --profile production

# Android APK (direct install)
eas build --platform android --profile apk
eas build --profile apk --platform android

## Build numbers
# Managed by EAS (eas.json: appVersionSource "remote" + production "autoIncrement").
# Every production build takes the next number automatically. Check with:
#   eas build:version:get
# Don't put buildNumber / versionCode in app.json — EAS ignores them.

## Rule: bump "version" in app.json before every native store release
## Rule: minimumAppVersion in app.json extra must be updated before native build if forcing upgrades

## Dev
npx expo run:ios
npx expo run:android


eas build --platform ios --profile production --auto-submit
