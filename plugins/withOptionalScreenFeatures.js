// plugins/withOptionalScreenFeatures.js
//
// "orientation": "portrait" in app.json locks the activity to portrait. From
// that, Google Play infers that the app *requires*
// android.hardware.screen.portrait, which hides it from tablets, Chromebooks,
// desktops and Android XR. Declaring the feature as not required keeps the
// portrait lock but lets every device install the app.
const { withAndroidManifest } = require("expo/config-plugins");

const FEATURES = ["android.hardware.screen.portrait", "android.hardware.screen.landscape"];

module.exports = function withOptionalScreenFeatures(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest["uses-feature"] = manifest["uses-feature"] || [];
    for (const name of FEATURES) {
      const existing = manifest["uses-feature"].find((f) => f.$?.["android:name"] === name);
      if (existing) existing.$["android:required"] = "false";
      else manifest["uses-feature"].push({ $: { "android:name": name, "android:required": "false" } });
    }
    return cfg;
  });
};
