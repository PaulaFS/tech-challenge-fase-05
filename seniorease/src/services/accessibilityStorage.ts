import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AccessibilitySettings,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "@/domain/entities/AccessibilitySettings";

import { STORAGE_KEYS } from "@/data/storage/storageKeys";

export async function getAccessibilitySettings(): Promise<AccessibilitySettings> {
  try {
    const storedSettings = await AsyncStorage.getItem(
      STORAGE_KEYS.accessibilitySettings,
    );

    if (!storedSettings) {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }

    const parsedSettings = JSON.parse(
      storedSettings,
    ) as Partial<AccessibilitySettings>;

    return {
      ...DEFAULT_ACCESSIBILITY_SETTINGS,
      ...parsedSettings,
    };
  } catch {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
}

export async function saveAccessibilitySettings(
  settings: AccessibilitySettings,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.accessibilitySettings,
    JSON.stringify(settings),
  );
}

export async function clearAccessibilitySettings(): Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEYS.accessibilitySettings,
  );
}