import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  FontSizeOption,
  SpacingOption,
} from "@/domain/entities/AccessibilitySettings";

import { useAccessibility } from "@/contexts/AccessibilityContext";

const fontOptions: Array<{
  value: FontSizeOption;
  label: string;
  example: string;
}> = [
  {
    value: "normal",
    label: "Normal",
    example: "Texto normal",
  },
  {
    value: "grande",
    label: "Grande",
    example: "Texto grande",
  },
  {
    value: "extraGrande",
    label: "Muito grande",
    example: "Texto muito grande",
  },
];

const spacingOptions: Array<{
  value: SpacingOption;
  label: string;
}> = [
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "amplo",
    label: "Espaçamento amplo",
  },
];

export default function AccessibilitySettingsScreen() {
  const {
    settings,
    fontScale,
    spacingScale,
    colors,
    updateSettings,
    resetSettings,
  } = useAccessibility();

  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  async function changeSetting(
    values: Parameters<
      typeof updateSettings
    >[0],
  ) {
    try {
      setSaving(true);
      setFeedbackMessage("");

      await updateSettings(values);

      if (settings.reinforcedFeedback) {
        setFeedbackMessage(
          "Configuração atualizada com sucesso.",
        );
      }
    } catch {
      setFeedbackMessage(
        "Não foi possível salvar a configuração.",
      );
    } finally {
      setSaving(false);
    }
  }

  function requestReset() {
    if (!settings.confirmCriticalActions) {
      void handleReset();
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Deseja restaurar todas as configurações de acessibilidade?",
      );

      if (confirmed) {
        void handleReset();
      }

      return;
    }

    Alert.alert(
      "Restaurar configurações",
      "Deseja voltar para as configurações originais?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Restaurar",
          onPress: () => void handleReset(),
        },
      ],
    );
  }

  async function handleReset() {
    try {
      setSaving(true);

      await resetSettings();

      setFeedbackMessage(
        "Configurações restauradas.",
      );
    } catch {
      setFeedbackMessage(
        "Não foi possível restaurar as configurações.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          gap: 24 * spacingScale,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={{ gap: 8 * spacingScale }}>
        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: 32 * fontScale,
            },
          ]}
        >
          Acessibilidade
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
              fontSize: 19 * fontScale,
              lineHeight: 28 * fontScale,
            },
          ]}
        >
          Escolha como você prefere visualizar e
          utilizar o aplicativo.
        </Text>
      </View>

      {feedbackMessage ? (
        <View
          accessibilityRole="alert"
          style={[
            styles.feedback,
            {
              borderColor: colors.success,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              {
                color: colors.success,
                fontSize: 18 * fontScale,
              },
            ]}
          >
            ✓ {feedbackMessage}
          </Text>
        </View>
      ) : null}

      <SettingsSection
        title="Tamanho do texto"
        description="Escolha o tamanho mais confortável para leitura."
      >
        <View
          style={[
            styles.options,
            { gap: 12 * spacingScale },
          ]}
        >
          {fontOptions.map((option) => {
            const selected =
              settings.fontSize === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{
                  checked: selected,
                  disabled: saving,
                }}
                accessibilityLabel={
                  option.label
                }
                disabled={saving}
                onPress={() =>
                  void changeSetting({
                    fontSize: option.value,
                  })
                }
                style={[
                  styles.optionButton,
                  {
                    borderColor: selected
                      ? colors.primary
                      : colors.border,
                    backgroundColor: selected
                      ? colors.primary
                      : colors.surface,
                    minHeight:
                      58 * spacingScale,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected
                      ? colors.primaryText
                      : colors.text,
                    fontSize:
                      option.value ===
                      "extraGrande"
                        ? 22
                        : option.value ===
                            "grande"
                          ? 20
                          : 18,
                    fontWeight: "700",
                  }}
                >
                  {option.example}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SettingsSection>

      <SettingsSection
        title="Espaçamento"
        description="Aumente a distância entre os elementos da tela."
      >
        <View
          style={[
            styles.options,
            { gap: 12 * spacingScale },
          ]}
        >
          {spacingOptions.map((option) => {
            const selected =
              settings.spacing === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{
                  checked: selected,
                  disabled: saving,
                }}
                disabled={saving}
                onPress={() =>
                  void changeSetting({
                    spacing: option.value,
                  })
                }
                style={[
                  styles.optionButton,
                  {
                    borderColor: selected
                      ? colors.primary
                      : colors.border,
                    backgroundColor: selected
                      ? colors.primary
                      : colors.surface,
                    minHeight:
                      58 * spacingScale,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected
                      ? colors.primaryText
                      : colors.text,
                    fontSize: 18 * fontScale,
                    fontWeight: "700",
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SettingsSection>

      <SettingsSection
        title="Outras preferências"
        description="Ative ou desative recursos de apoio."
      >
        <View
          style={[
            styles.preferences,
            { gap: 14 * spacingScale },
          ]}
        >
          <PreferenceSwitch
            title="Alto contraste"
            description="Utiliza fundo escuro e cores com maior contraste."
            value={settings.highContrast}
            disabled={saving}
            onChange={(value) =>
              void changeSetting({
                highContrast: value,
              })
            }
          />

          <PreferenceSwitch
            title="Modo simplificado"
            description="Mostra somente as funções principais."
            value={settings.simplifiedMode}
            disabled={saving}
            onChange={(value) =>
              void changeSetting({
                simplifiedMode: value,
              })
            }
          />

          <PreferenceSwitch
            title="Feedback reforçado"
            description="Mostra mensagens claras após cada ação."
            value={
              settings.reinforcedFeedback
            }
            disabled={saving}
            onChange={(value) =>
              void changeSetting({
                reinforcedFeedback: value,
              })
            }
          />

          <PreferenceSwitch
            title="Confirmar ações importantes"
            description="Pede confirmação antes de excluir ou restaurar dados."
            value={
              settings.confirmCriticalActions
            }
            disabled={saving}
            onChange={(value) =>
              void changeSetting({
                confirmCriticalActions: value,
              })
            }
          />
        </View>
      </SettingsSection>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Restaurar configurações originais"
        accessibilityState={{
          disabled: saving,
        }}
        disabled={saving}
        onPress={requestReset}
        style={({ pressed }) => [
          styles.resetButton,
          {
            borderColor: colors.danger,
            backgroundColor: colors.surface,
            minHeight: 58 * spacingScale,
          },
          pressed && styles.pressed,
          saving && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.resetButtonText,
            {
              color: colors.danger,
              fontSize: 19 * fontScale,
            },
          ]}
        >
          Restaurar configurações
        </Text>
      </Pressable>
    </ScrollView>
  );
}

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  const {
    colors,
    fontScale,
    spacingScale,
  } = useAccessibility();

  return (
    <View
      style={[
        styles.section,
        {
          gap: 16 * spacingScale,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View
        style={{ gap: 6 * spacingScale }}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
              fontSize: 23 * fontScale,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionDescription,
            {
              color: colors.secondaryText,
              fontSize: 17 * fontScale,
              lineHeight: 25 * fontScale,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      {children}
    </View>
  );
}

interface PreferenceSwitchProps {
  title: string;
  description: string;
  value: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}

function PreferenceSwitch({
  title,
  description,
  value,
  disabled,
  onChange,
}: PreferenceSwitchProps) {
  const {
    colors,
    fontScale,
    spacingScale,
  } = useAccessibility();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{
        checked: value,
        disabled,
      }}
      accessibilityLabel={title}
      accessibilityHint={description}
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={({ pressed }) => [
        styles.preference,
        {
          borderColor: colors.border,
          minHeight: 76 * spacingScale,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.preferenceText}>
        <Text
          style={[
            styles.preferenceTitle,
            {
              color: colors.text,
              fontSize: 19 * fontScale,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.preferenceDescription,
            {
              color: colors.secondaryText,
              fontSize: 16 * fontScale,
              lineHeight: 23 * fontScale,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      <View
        style={[
          styles.switchTrack,
          {
            backgroundColor: value
              ? colors.primary
              : colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            value && styles.switchThumbActive,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    padding: 24,
  },
  title: {
    fontWeight: "800",
  },
  subtitle: {},
  feedback: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
  },
  feedbackText: {
    fontWeight: "700",
  },
  section: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: "800",
  },
  sectionDescription: {},
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    flexGrow: 1,
    flexBasis: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 12,
  },
  preferences: {},
  preference: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
  },
  preferenceText: {
    flex: 1,
    gap: 4,
  },
  preferenceTitle: {
    fontWeight: "800",
  },
  preferenceDescription: {},
  switchTrack: {
    width: 58,
    height: 34,
    justifyContent: "center",
    padding: 4,
    borderRadius: 20,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },
  switchThumbActive: {
    alignSelf: "flex-end",
  },
  resetButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: 12,
  },
  resetButtonText: {
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});