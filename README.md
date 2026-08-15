# Hostelhubb

## OTA Updates (JS only — no native changes)
eas update --branch production --message "hostel sharing link and image" --platform ios


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

## Current Build Numbers
# android  buildNumber=34  version=3.7.0
# ios      buildNumber=34  version=3.7.0

## Rule: bump version + buildNumber in app.json before every native build
## Rule: minimumAppVersion in app.json extra must be updated before native build if forcing upgrades

## Dev
npx expo run:ios
npx expo run:android