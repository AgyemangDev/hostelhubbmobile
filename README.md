# Hostelhubb

## OTA Updates (JS only — no native changes)
eas update --branch production --message "notifications update" --platform ios


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
## Local iOS builds

### `pod install` fails: "The Swift pod `AppCheckCore` … do not define modules"

`AppCheckCore` (via Firebase / Google Sign-In) is a Swift pod and can't build as a
static library against dependencies that emit no module map. Fixed by
`plugins/withFirebaseModularHeaders.js`, which adds modular headers for
`GoogleUtilities` and `RecaptchaInterop` on every prebuild.

Do **not** replace it with a global `use_modular_headers!` — that applies to every
pod and breaks other Expo modules.

Note `pod install` runs from `ios/`, not the project root.

### `expo run:ios` fails with "No code signing certificates are available"

Expo CLI 54.0.23 can't parse `devicectl` output from Xcode 26+
("Unexpected devicectl JSON version output"), so it treats the simulator as a
physical device and demands signing — even when passed a simulator UDID.

Until the CLI catches up, build for the simulator directly:

```bash
# 1. pick a booted simulator
xcrun simctl list devices booted

# 2. build (skip signing — simulator builds don't need it)
cd ios
xcodebuild -workspace Hostelhubb.xcworkspace -scheme Hostelhubb \
  -configuration Debug -sdk iphonesimulator \
  -destination "id=<SIMULATOR_UDID>" \
  -derivedDataPath build CODE_SIGNING_ALLOWED=NO

# 3. install + launch
xcrun simctl install <SIMULATOR_UDID> \
  build/Build/Products/Debug-iphonesimulator/Hostelhubb.app
xcrun simctl launch <SIMULATOR_UDID> com.Hostelhubb.Hostelhubb

# 4. start Metro (use a free port if 8081 is taken by another project)
npx expo start --dev-client --port 8082
```

EAS builds are unaffected — this is a local-toolchain mismatch only.
