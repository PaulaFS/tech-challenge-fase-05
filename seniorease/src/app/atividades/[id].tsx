import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  Activity,
  ActivityCategory,
} from "@/domain/entities/Activity";

import {
  completeActivity,
  deleteActivity,
  getActivityById,
} from "@/services/activityStorage";

import {
  useTheme,
} from "../../constants/theme";

import {
  useAccessibility,
} from "@/contexts/AccessibilityContext";

import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";

const categoryLabels: Record<
  ActivityCategory,
  string
> = {
  saude: "Saúde",
  casa: "Casa",
  estudo: "Estudo",
  trabalho: "Trabalho",
  compromisso: "Compromisso",
  outros: "Outros",
};

export default function ActivityDetailsScreen() {
  const {
    fontSize,
    colors,
    spacing,
    borderRadius,
  } = useTheme();

  const {
    isBasicMode,
  } = useAccessibility();

  const params =
    useLocalSearchParams<{ id: string }>();

  const [
    activity,
    setActivity,
  ] = useState<Activity | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const activityId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const loadActivity = useCallback(
    async () => {
      if (!activityId) {
        setErrorMessage(
          "Atividade inválida.",
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const storedActivity =
          await getActivityById(activityId);

        if (!storedActivity) {
          setErrorMessage(
            "Atividade não encontrada.",
          );

          setActivity(null);
          return;
        }

        setActivity(storedActivity);
        setErrorMessage("");
      } catch {
        setErrorMessage(
          "Não foi possível carregar esta atividade.",
        );
      } finally {
        setLoading(false);
      }
    },
    [activityId],
  );

  useFocusEffect(
    useCallback(() => {
      void loadActivity();
    }, [loadActivity]),
  );

  async function handleComplete() {
    if (!activity || processing) {
      return;
    }

    try {
      setProcessing(true);

      const completedActivity =
        await completeActivity(activity.id);

      setActivity(completedActivity);

      Alert.alert(
        "Sucesso",
        "Atividade concluída com sucesso!",
      );
    } catch {
      setErrorMessage(
        "Não foi possível concluir a atividade.",
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleDelete() {
    if (!activity || processing) {
      return;
    }

    try {
      setProcessing(true);

      await deleteActivity(activity.id);

      router.back();
    } catch {
      setErrorMessage(
        "Não foi possível excluir a atividade.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function requestDelete() {
    if (!activity) {
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Deseja realmente excluir a atividade "${activity.title}"?`,
      );

      if (confirmed) {
        void handleDelete();
      }

      return;
    }

    Alert.alert(
      "Excluir",
      `Deseja realmente excluir "${activity.title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            void handleDelete(),
        },
      ],
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          {
            backgroundColor:
              colors.background,
            padding: spacing.lg,
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

  if (!activity) {
    return (
      <View
        style={[
          styles.centerContainer,
          {
            backgroundColor:
              colors.background,
            padding: spacing.lg,
          },
        ]}
      >
        <Text
          style={[
            styles.errorText,
            {
              fontSize,
            },
          ]}
        >
          {errorMessage ||
            "Atividade não encontrada."}
        </Text>
      </View>
    );
  }

  const shouldShowCategory =
    !isBasicMode;

  const shouldShowDescription =
    !isBasicMode &&
    Boolean(activity.description.trim());

  const formattedDateTime =
    activity.time.trim()
      ? `${activity.date} às ${activity.time}`
      : activity.date;

  const isCompleted =
    activity.status === "concluida";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor:
            colors.background,
          padding: spacing.lg,
          gap: spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.cardBackground,
            borderColor: colors.border,
            borderRadius:
              borderRadius.lg,
            padding: spacing.lg,
            gap: spacing.md,
          },
        ]}
      >
        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize:
                fontSize * 1.5,
            },
          ]}
        >
          {activity.title}
        </Text>

        <View
          style={[
            styles.informationGroup,
            {
              gap: spacing.sm,
            },
          ]}
        >
          <View
            style={[
              styles.informationRow,
              {
                gap: spacing.sm,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-outline"
              size={fontSize * 1.35}
              color={colors.primary}
            />

            <Text
              style={[
                styles.primaryInformation,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              {formattedDateTime}
            </Text>
          </View>

          <View
            style={[
              styles.informationRow,
              {
                gap: spacing.sm,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                isCompleted
                  ? "check-circle-outline"
                  : "clock-outline"
              }
              size={fontSize * 1.35}
              color={
                isCompleted
                  ? "#18794E"
                  : colors.primary
              }
            />

            <Text
              style={[
                styles.status,
                {
                  color: isCompleted
                    ? "#18794E"
                    : colors.primary,
                  fontSize,
                },
              ]}
            >
              {isCompleted
                ? "Atividade concluída"
                : "Atividade pendente"}
            </Text>
          </View>
        </View>

        {shouldShowCategory && (
          <Text
            style={[
              styles.label,
              {
                color:
                  colors.textSecondary ||
                  colors.text,
                fontSize:
                  fontSize * 0.9,
              },
            ]}
          >
            Categoria:{" "}
            <Text
              style={{
                fontFamily:
                  "Montserrat_700Bold",
              }}
            >
              {
                categoryLabels[
                activity.category
                ]
              }
            </Text>
          </Text>
        )}

        {shouldShowDescription && (
          <View
            style={[
              styles.descriptionContainer,
              {
                backgroundColor:
                  colors.background,
                borderRadius:
                  borderRadius.md,
                padding: spacing.md,
                gap: spacing.xs,
              },
            ]}
          >
            <Text
              style={[
                styles.descriptionTitle,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              Descrição
            </Text>

            <Text
              style={[
                styles.description,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              {activity.description}
            </Text>
          </View>
        )}

        {isBasicMode && (
          <View
            style={[
              styles.basicModeBox,
              {
                borderColor:
                  colors.primary,
                borderRadius:
                  borderRadius.md,
                padding: spacing.md,
                gap: spacing.sm,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={fontSize * 1.3}
              color={colors.primary}
            />

            <Text
              style={[
                styles.basicModeMessage,
                {
                  color:
                    colors.textSecondary ||
                    colors.text,
                  fontSize:
                    fontSize * 0.85,
                },
              ]}
            >
              Modo básico ativo: somente as
              informações essenciais estão
              sendo exibidas.
            </Text>
          </View>
        )}
      </View>

      {errorMessage ? (
        <Text
          accessibilityRole="alert"
          style={[
            styles.errorText,
            {
              fontSize,
            },
          ]}
        >
          {errorMessage}
        </Text>
      ) : null}

      {activity.status ===
        "pendente" && (
          <>
            <Pressable
              onPress={handleComplete}
              disabled={processing}
              accessibilityRole="button"
              accessibilityLabel="Concluir atividade"
              accessibilityHint="Marca esta atividade como concluída"
              style={[
                styles.completeButton,
                {
                  borderRadius:
                    borderRadius.md,
                  minHeight: 56,
                  marginTop:
                    spacing.xs,
                  opacity: processing
                    ? 0.7
                    : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize,
                  },
                ]}
              >
                {processing
                  ? "Processando..."
                  : "Concluir atividade"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    "/atividades/editar/[id]",
                  params: {
                    id: activity.id,
                  },
                })
              }
              disabled={processing}
              accessibilityRole="button"
              accessibilityLabel="Editar atividade"
              accessibilityHint="Abre o formulário para alterar esta atividade"
              style={[
                styles.editButton,
                {
                  borderRadius:
                    borderRadius.md,
                  minHeight: 56,
                  backgroundColor:
                    colors.cardBackground,
                  borderColor:
                    colors.primary,
                  opacity: processing
                    ? 0.7
                    : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.editButtonText,
                  {
                    color:
                      colors.primary,
                    fontSize,
                  },
                ]}
              >
                Editar atividade
              </Text>
            </Pressable>
          </>
        )}

      <Pressable
        onPress={requestDelete}
        disabled={processing}
        accessibilityRole="button"
        accessibilityLabel="Excluir atividade"
        accessibilityHint="Solicita confirmação antes de excluir esta atividade"
        style={[
          styles.deleteButton,
          {
            borderRadius:
              borderRadius.md,
            minHeight: 56,
            backgroundColor:
              colors.cardBackground,
            borderColor: "#A4161A",
            opacity: processing
              ? 0.7
              : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.deleteButtonText,
            {
              fontSize,
            },
          ]}
        >
          Excluir atividade
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    flexGrow: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  title: {
    fontFamily:
      "Montserrat_700Bold",
  },

  informationGroup: {
    width: "100%",
  },

  informationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  primaryInformation: {
    flex: 1,
    fontFamily:
      "Montserrat_700Bold",
  },

  label: {
    fontFamily:
      "Montserrat_400Regular",
    opacity: 0.8,
  },

  descriptionContainer: {
    width: "100%",
  },

  descriptionTitle: {
    fontFamily:
      "Montserrat_700Bold",
  },

  description: {
    fontFamily:
      "Montserrat_400Regular",
    lineHeight: 24,
  },

  status: {
    flex: 1,
    fontFamily:
      "Montserrat_700Bold",
  },

  basicModeBox: {
    width: "100%",
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },

  basicModeMessage: {
    flex: 1,
    fontFamily:
      "Montserrat_400Regular",
    lineHeight: 22,
  },

  completeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18794E",
    elevation: 2,
  },

  editButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    elevation: 2,
  },

  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    elevation: 2,
  },

  buttonText: {
    fontFamily:
      "Montserrat_700Bold",
    color: "#FFFFFF",
  },

  editButtonText: {
    fontFamily:
      "Montserrat_700Bold",
  },

  deleteButtonText: {
    fontFamily:
      "Montserrat_700Bold",
    color: "#A4161A",
  },

  errorText: {
    fontFamily:
      "Montserrat_700Bold",
    color: "#A4161A",
    textAlign: "center",
  },
});