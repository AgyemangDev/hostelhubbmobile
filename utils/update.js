// utils/versionManager.js
import * as Updates from "expo-updates";
import Constants from 'expo-constants';

/**
 * Gets the minimum required native build version from EAS update metadata
 * This is embedded in your OTA update, no backend needed!
 */
export const getMinimumRequiredVersion = async () => {
  try {
    // Check the current update's manifest for minimum version
    const manifest = Updates.manifest;
    
    // You can embed this in your update metadata
    return manifest?.extra?.minimumAppVersion || null;
  } catch (error) {
    console.error("Error getting minimum version:", error);
    return null;
  }
};

/**
 * Compares semantic versions (e.g., "3.4.0" vs "3.0.0")
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  
  return 0;
};

/**
 * Checks for OTA updates and applies them
 * Returns: { updateApplied: boolean, requiresNativeUpdate: boolean, minimumVersion: string | null }
 */
export const checkForAppUpdates = async () => {
  // Skip in development
  if (__DEV__) {
    console.log('⚠️ Skipping update check in development');
    return { updateApplied: false, requiresNativeUpdate: false, minimumVersion: null };
  }

  try {
    console.log('🔍 Checking for updates...');
    console.log('📱 Current native version:', Constants.expoConfig?.version);
    console.log('🏷️  Runtime version:', Updates.runtimeVersion);
    console.log('📦 Current update ID:', Updates.updateId);
    console.log('📺 Channel:', Updates.channel);
    
    const update = await Updates.checkForUpdateAsync();
    console.log('📬 Update available?', update.isAvailable);

    if (update.isAvailable) {
      console.log('📥 Fetching update...');
      const fetchResult = await Updates.fetchUpdateAsync();
      
      // Check if the new update requires a native update
      const manifest = fetchResult.manifest;
      const minimumVersion = manifest?.extra?.minimumAppVersion;
      const currentVersion = Constants.expoConfig?.version;
      
      console.log('📋 Update manifest minimum version:', minimumVersion);
      console.log('📱 Current app version:', currentVersion);
      
      if (minimumVersion && currentVersion) {
        const needsNativeUpdate = compareVersions(currentVersion, minimumVersion) < 0;
        
        if (needsNativeUpdate) {
          console.log('🚨 Native update required!');
          return { 
            updateApplied: false, 
            requiresNativeUpdate: true, 
            minimumVersion 
          };
        }
      }
      
      // Apply the OTA update
      console.log('✅ Applying OTA update...');
      await Updates.reloadAsync();
      return { updateApplied: true, requiresNativeUpdate: false, minimumVersion: null };
    } else {
      console.log('✅ App is up to date');
      return { updateApplied: false, requiresNativeUpdate: false, minimumVersion: null };
    }
  } catch (error) {
    console.error("❌ Error checking for updates:", error);
    return { updateApplied: false, requiresNativeUpdate: false, minimumVersion: null };
  }
};