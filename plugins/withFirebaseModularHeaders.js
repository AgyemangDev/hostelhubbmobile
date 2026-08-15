const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Keeps the iOS Podfile buildable with Firebase / Google Sign-In.
 *
 * `AppCheckCore` (pulled in by Firebase and @react-native-google-signin) is a
 * Swift pod. CocoaPods refuses to build a Swift pod as a static library when its
 * dependencies don't emit module maps, which fails `pod install` with:
 *
 *   The Swift pod `AppCheckCore` depends upon `GoogleUtilities` and
 *   `RecaptchaInterop`, which do not define modules.
 *
 * The narrow fix is opting just those two pods into modular headers. Setting
 * `use_modular_headers!` globally would apply it to every pod and breaks several
 * Expo modules.
 *
 * `ios/` is prebuild output, so a hand-edit of the Podfile is lost on
 * `expo prebuild --clean`. This plugin re-applies it every time.
 */

const MARKER = "withFirebaseModularHeaders";

const BLOCK = `
  # ${MARKER}: AppCheckCore is a Swift pod and cannot build as a static library
  # against dependencies that emit no module map. Narrow fix — do NOT replace
  # this with a global use_modular_headers!, which breaks other Expo modules.
  pod 'GoogleUtilities', :modular_headers => true
  pod 'RecaptchaInterop', :modular_headers => true
`;

const withFirebaseModularHeaders = (config) =>
  withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      if (contents.includes(MARKER)) return cfg;

      // Anchor on `use_expo_modules!`, which every Expo Podfile has inside the
      // app target — the pods must be declared within the target block.
      const anchor = "use_expo_modules!";
      if (!contents.includes(anchor)) {
        throw new Error(
          `[${MARKER}] Could not find "${anchor}" in the Podfile; the Podfile template has changed and this plugin needs updating.`
        );
      }

      contents = contents.replace(anchor, `${anchor}\n${BLOCK}`);
      fs.writeFileSync(podfilePath, contents);
      return cfg;
    },
  ]);

module.exports = withFirebaseModularHeaders;
