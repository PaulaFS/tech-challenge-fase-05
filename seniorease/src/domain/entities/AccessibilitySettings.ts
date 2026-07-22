export type FontSizeOption = "normal" | "grande" | "extraGrande";
export type SpacingOption = "normal" | "amplo";

export interface AccessibilitySettings {
  fontSize: FontSizeOption;
  highContrast: boolean;
  spacing: SpacingOption;
  simplifiedMode: boolean;
  reinforcedFeedback: boolean;
  confirmCriticalActions: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontSize: "normal",
  highContrast: false,
  spacing: "normal",
  simplifiedMode: false,
  reinforcedFeedback: true,
  confirmCriticalActions: true,
};