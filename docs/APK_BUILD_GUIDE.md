# APK Build & Deployment Guide

This document provides step-by-step instructions on how to build a production-ready APK for the **Ev Envanter ve Garanti Takip** application.

## Prerequisites

1.  **Node.js**: Ensure Node.js (LTS version) is installed.
2.  **EAS CLI**: Expo Application Services CLI is required for building.
    ```bash
    npm install -g eas-cli
    ```
3.  **Expo Account**: You need an active Expo account to use EAS Build.

## Step 1: Login to EAS

Run the following command to log in to your Expo account:
```bash
eas login
```

## Step 2: Initialize EAS

If you haven't already, configure your project for EAS Build:
```bash
eas build:configure
```
This command will create an `eas.json` file in your project root.

## Step 3: Configure `eas.json` for APK

To build an `.apk` file instead of an `.aab` (Android App Bundle, which is the default for Google Play Store), update your `eas.json` file. The `preview` profile is commonly used for APK builds.

```json
{
  "cli": {
    "version": ">= 3.5.2"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Step 4: Run the Build Command

Execute the following command to start building your APK:
```bash
eas build -p android --profile preview
```

### What happens next?
- EAS CLI will ask you to generate or provide an Android Keystore. Allow it to generate one for you if this is your first time.
- The build will be queued on Expo's servers.
- You will be provided with a link to the Expo dashboard where you can monitor the progress of your build.

## Step 5: Download the APK

Once the build finishes successfully:
- You will see a success message in your terminal along with a direct download link.
- You can also go to your Expo dashboard, navigate to the **Builds** section, and download the APK from there.

## Step 6: Install on Android Device

1. Download the APK directly onto your Android device or transfer it via USB/Email.
2. Ensure that **"Install from Unknown Sources"** is enabled in your Android device's settings (usually under Settings > Security or Settings > Apps).
3. Tap on the `.apk` file to install the application.

---

### Troubleshooting

- **Keystore Issues:** If you encounter keystore issues, you can clear the existing keystore by running `eas credentials` and following the prompts to reset it.
- **Build Failures:** Check the build logs in the Expo dashboard. Often, failures are due to incompatible package versions. Ensure your packages are compatible with your Expo SDK version by running `npx expo install --fix`.
