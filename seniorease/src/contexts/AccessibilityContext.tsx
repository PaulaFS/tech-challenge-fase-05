import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AccessibilitySettings,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "@/domain/entities/AccessibilitySettings";

import {
  clearAccessibilitySettings,
  getAccessibilitySettings,
  saveAccessibilitySettings,
} from "@/services/accessibilityStorage";

interface AccessibilityColors {
  background: string;
  surface: string;
  text: string;
  secondaryText: string;
  primary: string;
  primaryText: string;
  border: string;
  success: string;
  danger: string;
}

interface AccessibilityContextData {
  settings: AccessibilitySettings;
  loading: boolean;
  fontScale: number;
  spacingScale: number;
  colors: AccessibilityColors;
  updateSettings: (
    values: Partial<AccessibilitySettings>,
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const AccessibilityContext =
  createContext<AccessibilityContextData | null>(null);

export function AccessibilityProvider({
  children,
}: PropsWithChildren) {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(
      DEFAULT_ACCESSIBILITY_SETTINGS,
    );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const storedSettings =
        await getAccessibilitySettings();

      setSettings(storedSettings);
      setLoading(false);
    }

    void loadSettings();
  }, []);

  const updateSettings = useCallback(
    async (
      values: Partial<AccessibilitySettings>,
    ) => {
      const updatedSettings = {
        ...settings,
        ...values,
      };

      setSettings(updatedSettings);

      try {
        await saveAccessibilitySettings(
          updatedSettings,
        );
      } catch (error) {
        setSettings(settings);
        throw error;
      }
    },
    [settings],
  );

  const resetSettings = useCallback(async () => {
    await clearAccessibilitySettings();

    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  }, []);

  const fontScale = useMemo(() => {
    switch (settings.fontSize) {
      case "grande":
        return 1.15;

      case "extraGrande":
        return 1.3;

      default:
        return 1;
    }
  }, [settings.fontSize]);

  const spacingScale =
    settings.spacing === "amplo" ? 1.3 : 1;

  const colors = useMemo<AccessibilityColors>(() => {
    if (settings.highContrast) {
      return {
        background: "#000000",
        surface: "#111111",
        text: "#FFFFFF",
        secondaryText: "#F2F2F2",
        primary: "#FFFF00",
        primaryText: "#000000",
        border: "#FFFFFF",
        success: "#4DFF88",
        danger: "#FF6B6B",
      };
    }

    return {
      background: "#F5F7FA",
      surface: "#FFFFFF",
      text: "#202020",
      secondaryText: "#4A4A4A",
      primary: "#2457C5",
      primaryText: "#FFFFFF",
      border: "#737373",
      success: "#18794E",
      danger: "#A4161A",
    };
  }, [settings.highContrast]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      fontScale,
      spacingScale,
      colors,
      updateSettings,
      resetSettings,
    }),
    [
      settings,
      loading,
      fontScale,
      spacingScale,
      colors,
      updateSettings,
      resetSettings,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(
    AccessibilityContext,
  );

  if (!context) {
    throw new Error(
      "useAccessibility deve ser utilizado dentro de AccessibilityProvider.",
    );
  }

  return context;
}