# Hostelhubb
# eas update --branch production --message "2.0.3 OTA update" for update for same uapp

# for update, don't forget to add the extra for the hold build
#    "extra": {
    "minimumAppVersion": "3.4.0", this should be the new version
#       "eas": {
#         "projectId": "08c63846-777e-4efa-b66c-cd905718a34c"
#       },

# This targets users on runtime version 3.4.0 - This is done on the old build
eas update --branch production --message "Critical update - please upgrade" \
  --json='{"extra":{"minimumAppVersion":"3.5.0"}}'


# OTA update for android
eas update --branch production --message "2.0.3 OTA update" --platform android


# OTA update for ios
eas update --branch production --message "2.0.3 OTA update" --platform ios




# Ios Build
eas build --platform ios --profile production --non-interactive --auto-submit

# Production AAB
eas build --platform android --profile production

# Production APK
eas build --platform android --profile apk

# don't forget to change the build and version number back to 22 and 1.9.0 when doing 

# android  new 29 3.2.0
# ios  new 29 3.2.0


# android  old 25 2.0.3
# ios  old 26 2.0.4

# commonds
npx expo run:ios

#installations
npm install lucide-react-native

npm install @supabase/supabase-js


