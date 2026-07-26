import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";

import { useTheme } from "../constants/theme";

import {
  useAccessibility,
} from "@/contexts/AccessibilityContext";

const FONT_SIZES = [16, 22, 30];

export default function ConfigScreen() {
  const {
    fontSize,
    setFontSize,
    toggleDarkMode,
    isDarkMode,
    colors,
    spacing,
    borderRadius,
  } = useTheme();

  const {
    settings,
    updateSettings,
  } = useAccessibility();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  const isBasicMode =
    settings.interfaceMode === "basico";

  const isAdvancedMode =
    settings.interfaceMode === "avancado";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
          padding: spacing.lg,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: fontSize * 1.8,
            marginBottom: spacing.xl,
          },
        ]}
      >
        Configurações
      </Text>

      <View
        style={[
          styles.section,
          {
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color: colors.text,
              fontSize,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Tamanho da Fonte:
        </Text>

        <View
          style={[
            styles.buttonRow,
            {
              gap: spacing.sm,
            },
          ]}
        >
          {FONT_SIZES.map((size) => {
            const isSelected =
              fontSize === size;

            return (
              <Pressable
                key={size}
                onPress={() =>
                  setFontSize(size)
                }
                accessibilityRole="button"
                accessibilityLabel={
                  `Definir tamanho de fonte para ${size}`
                }
                accessibilityState={{
                  selected: isSelected,
                }}
                style={[
                  styles.sizeButton,
                  {
                    backgroundColor:
                      isSelected
                        ? colors.primary
                        : colors.cardBackground,

                    borderColor:
                      isSelected
                        ? colors.primary
                        : colors.border,

                    borderRadius:
                      borderRadius.md,

                    padding: spacing.md,
                    minWidth: 70,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    {
                      fontSize: size,
                      color:
                        isSelected
                          ? colors.buttonText
                          : colors.text,
                    },
                  ]}
                >
                  A
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={[
          styles.section,
          {
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Pressable
          onPress={toggleDarkMode}
          accessibilityRole="button"
          accessibilityLabel={
            isDarkMode
              ? "Ativar modo claro"
              : "Ativar modo escuro"
          }
          style={[
            styles.themeButton,
            {
              backgroundColor:
                colors.primary,

              borderRadius:
                borderRadius.md,

              padding: spacing.md,
              gap: spacing.sm,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={
              isDarkMode
                ? "weather-sunny"
                : "moon-waning-crescent"
            }
            size={fontSize * 1.2}
            color={colors.buttonText}
          />

          <Text
            style={[
              styles.buttonTextTheme,
              {
                color:
                  colors.buttonText,
                fontSize,
              },
            ]}
          >
            {isDarkMode
              ? "Modo Claro"
              : "Modo Escuro"}
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.settingSection,
          {
            backgroundColor:
              colors.cardBackground,

            borderColor:
              colors.border,

            borderRadius:
              borderRadius.lg,

            padding: spacing.lg,
            gap: spacing.md,
          },
        ]}
      >
        <Text
          style={[
            styles.settingTitle,
            {
              color: colors.text,
              fontSize:
                fontSize * 1.2,
            },
          ]}
        >
          Modo da interface
        </Text>

        <Text
          style={[
            styles.settingDescription,
            {
              color:
                colors.textSecondary ||
                colors.text,

              fontSize,
            },
          ]}
        >
          Escolha quantas informações
          devem aparecer nas telas.
        </Text>

        <View
          style={[
            styles.modeOptions,
            {
              gap: spacing.md,
              marginTop: spacing.xs,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ativar modo básico"
            accessibilityHint="Exibe somente as informações essenciais"
            accessibilityState={{
              selected: isBasicMode,
            }}
            onPress={() =>
              void updateSettings({
                interfaceMode: "basico",
              })
            }
            style={[
              styles.modeButton,
              {
                borderColor:
                  colors.primary,

                borderRadius:
                  borderRadius.md,

                paddingHorizontal:
                  spacing.md,

                paddingVertical:
                  spacing.md,

                backgroundColor:
                  isBasicMode
                    ? colors.primary
                    : colors.cardBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.modeButtonTitle,
                {
                  color:
                    isBasicMode
                      ? "#FFFFFF"
                      : colors.primary,

                  fontSize,
                },
              ]}
            >
              Modo básico
            </Text>

            <Text
              style={[
                styles.modeButtonDescription,
                {
                  color:
                    isBasicMode
                      ? "#FFFFFF"
                      : colors.textSecondary ||
                      colors.text,

                  fontSize:
                    fontSize * 0.9,
                },
              ]}
            >
              Exibe somente as informações
              essenciais.
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ativar modo avançado"
            accessibilityHint="Exibe todas as opções e campos"
            accessibilityState={{
              selected: isAdvancedMode,
            }}
            onPress={() =>
              void updateSettings({
                interfaceMode:
                  "avancado",
              })
            }
            style={[
              styles.modeButton,
              {
                borderColor:
                  colors.primary,

                borderRadius:
                  borderRadius.md,

                paddingHorizontal:
                  spacing.md,

                paddingVertical:
                  spacing.md,

                backgroundColor:
                  isAdvancedMode
                    ? colors.primary
                    : colors.cardBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.modeButtonTitle,
                {
                  color:
                    isAdvancedMode
                      ? "#FFFFFF"
                      : colors.primary,

                  fontSize,
                },
              ]}
            >
              Modo avançado
            </Text>

            <Text
              style={[
                styles.modeButtonDescription,
                {
                  color:
                    isAdvancedMode
                      ? "#FFFFFF"
                      : colors.textSecondary ||
                      colors.text,

                  fontSize:
                    fontSize * 0.9,
                },
              ]}
            >
              Exibe todas as opções e
              campos.
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },

  title: {
    fontFamily:
      "Montserrat_700Bold",
    textAlign: "center",
  },

  section: {
    width: "100%",
    alignItems: "center",
  },

  label: {
    fontFamily:
      "Montserrat_700Bold",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  sizeButton: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  sizeButtonText: {
    fontFamily:
      "Montserrat_700Bold",
  },

  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 56,
    justifyContent: "center",
    elevation: 3,
  },

  buttonTextTheme: {
    fontFamily:
      "Montserrat_700Bold",
  },

  settingSection: {
    width: "100%",
    borderWidth: 2,
  },

  settingTitle: {
    fontFamily:
      "Montserrat_700Bold",
  },

  settingDescription: {
    fontFamily:
      "Montserrat_400Regular",
    lineHeight: 24,
  },

  modeOptions: {
    width: "100%",
  },

  modeButton: {
    width: "100%",
    minHeight: 90,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    gap: 6,
    elevation: 2,
  },

  modeButtonTitle: {
    fontFamily:
      "Montserrat_700Bold",
    textAlign: "center",
  },

  modeButtonDescription: {
    fontFamily:
      "Montserrat_400Regular",
    lineHeight: 22,
    textAlign: "center",
  },
});