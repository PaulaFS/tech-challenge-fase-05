import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
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
import { Activity, ActivityCategory } from "@/domain/entities/Activity";
import { completeActivity, deleteActivity, getActivityById } from "@/services/activityStorage";
import { useTheme } from "../../constants/theme";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

const categoryLabels: Record<ActivityCategory, string> = {
  saude: "Saúde",
  casa: "Casa",
  estudo: "Estudo",
  trabalho: "Trabalho",
  compromisso: "Compromisso",
  outros: "Outros",
};

export default function ActivityDetailsScreen() {
  const { fontSize, colors, spacing, borderRadius } = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const activityId = Array.isArray(params.id) ? params.id[0] : params.id;

  const loadActivity = useCallback(async () => {
    if (!activityId) {
      setErrorMessage("Atividade inválida.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const storedActivity = await getActivityById(activityId);
      if (!storedActivity) {
        setErrorMessage("Atividade não encontrada.");
        setActivity(null);
        return;
      }
      setActivity(storedActivity);
    } catch {
      setErrorMessage("Não foi possível carregar esta atividade.");
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useFocusEffect(
    useCallback(() => {
      void loadActivity();
    }, [loadActivity]),
  );

  async function handleComplete() {
    if (!activity || processing) return;

    try {
      setProcessing(true);
      const completedActivity = await completeActivity(activity.id);
      setActivity(completedActivity);
      Alert.alert("Sucesso", "Atividade concluída com sucesso!");
    } catch {
      setErrorMessage("Não foi possível concluir a atividade.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleDelete() {
    if (!activity || processing) return;

    try {
      setProcessing(true);
      await deleteActivity(activity.id);
      router.back();
    } catch {
      setErrorMessage("Não foi possível excluir a atividade.");
    } finally {
      setProcessing(false);
    }
  }

  function requestDelete() {
    if (!activity) return;

    if (Platform.OS === "web") {
      if (window.confirm(`Deseja realmente excluir a atividade "${activity.title}"?`)) {
        void handleDelete();
      }
      return;
    }

    Alert.alert("Excluir", `Deseja realmente excluir "${activity.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => void handleDelete() },
    ]);
  }

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <Text style={[styles.errorText, { fontSize: fontSize }]}>{errorMessage || "Atividade não encontrada."}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            gap: spacing.sm
          }
        ]}
      >
        <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 1.5 }]}>{activity.title}</Text>

        <Text style={[styles.label, { color: colors.textSecondary || colors.text, fontSize: fontSize * 0.9 }]}>
          Categoria: <Text style={{ fontFamily: 'Montserrat_700Bold' }}>{categoryLabels[activity.category]}</Text>
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary || colors.text, fontSize: fontSize * 0.9 }]}>
          Data: <Text style={{ fontFamily: 'Montserrat_700Bold' }}>{activity.date} {activity.time ? `às ${activity.time}` : ""}</Text>
        </Text>

        {activity.description ? (
          <Text style={[styles.description, { color: colors.text, fontSize: fontSize, marginTop: spacing.xs }]}>{activity.description}</Text>
        ) : null}

        <Text style={[styles.status, { color: activity.status === 'concluida' ? '#18794E' : colors.primary, fontSize: fontSize, marginTop: spacing.xs }]}>
          Status: {activity.status.toUpperCase()}
        </Text>
      </View>

      {activity.status === "pendente" && (
        <>
          <Pressable
            onPress={handleComplete}
            disabled={processing}
            style={[
              styles.completeButton,
              {
                borderRadius:
                  borderRadius.md,
                minHeight: 56,
                marginTop: spacing.xs,
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
                  color: colors.primary,
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
        style={[
          styles.deleteButton,
          {
            borderRadius: borderRadius.md,
            minHeight: 56,
            backgroundColor: colors.cardBackground,
            borderColor: "#A4161A"
          }
        ]}
      >
        <Text style={[styles.deleteButtonText, { fontSize: fontSize }]}>Excluir Atividade</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
  },
  label: {
    fontFamily: 'Montserrat_400Regular',
    opacity: 0.8,
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
  },
  status: {
    fontFamily: 'Montserrat_700Bold',
  },
  completeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18794E",
    elevation: 2,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    elevation: 2,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#FFFFFF",
  },
  deleteButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#A4161A",
  },
  errorText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#A4161A",
    textAlign: "center",
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    elevation: 2,
  },

  editButtonText: {
    fontFamily: "Montserrat_700Bold",
  },
});