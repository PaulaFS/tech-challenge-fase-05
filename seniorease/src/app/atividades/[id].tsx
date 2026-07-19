import { router, useLocalSearchParams } from "expo-router";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useCallback, useEffect, useState } from "react";
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
  Activity,
  ActivityCategory,
} from "@/domain/entities/Activity";

import {
  completeActivity,
  deleteActivity,
  getActivityById,
} from "@/services/activityStorage";

const categoryLabels: Record<ActivityCategory, string> = {
  saude: "Saúde",
  casa: "Casa",
  estudo: "Estudo",
  trabalho: "Trabalho",
  compromisso: "Compromisso",
  outros: "Outros",
};

export default function ActivityDetailsScreen() {
  const { settings } = useAccessibility();

  const params = useLocalSearchParams<{ id: string }>();

  const [activity, setActivity] =
    useState<Activity | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activityId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const loadActivity = useCallback(async () => {
    if (!activityId) {
      setErrorMessage("Atividade inválida.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const storedActivity =
        await getActivityById(activityId);

      if (!storedActivity) {
        setErrorMessage("Atividade não encontrada.");
        setActivity(null);
        return;
      }

      setActivity(storedActivity);
    } catch {
      setErrorMessage(
        "Não foi possível carregar esta atividade.",
      );
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    void loadActivity();
  }, [loadActivity]);

  async function handleComplete() {
    if (!activity || processing) {
      return;
    }

    try {
      setProcessing(true);
      setErrorMessage("");

      const completedActivity =
        await completeActivity(activity.id);

      setActivity(completedActivity);

      showSuccessMessage(
        "Atividade concluída",
        "Muito bem! A atividade foi concluída com sucesso.",
      );
    } catch {
      setErrorMessage(
        "Não foi possível concluir a atividade.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function requestDelete() {
    if (!settings.confirmCriticalActions) {
      void handleDelete();
      return;
    }
    
    if (!activity || processing) {
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
      "Excluir atividade",
      `Deseja realmente excluir a atividade "${activity.title}"? Esta ação não poderá ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void handleDelete(),
        },
      ],
    );
  }

  async function handleDelete() {
    if (!activity || processing) {
      return;
    }

    try {
      setProcessing(true);
      setErrorMessage("");

      await deleteActivity(activity.id);

      if (Platform.OS === "web") {
        window.alert("Atividade excluída com sucesso.");
      }

      router.replace("/atividades");
    } catch {
      setErrorMessage(
        "Não foi possível excluir a atividade.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function showSuccessMessage(
    title: string,
    message: string,
  ) {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          accessibilityLabel="Carregando atividade"
        />

        <Text style={styles.loadingText}>
          Carregando atividade...
        </Text>
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.centerContainer}>
        <Text
          accessibilityRole="alert"
          style={styles.errorTitle}
        >
          {errorMessage || "Atividade não encontrada."}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/atividades")}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            Voltar para atividades
          </Text>
        </Pressable>
      </View>
    );
  }

  const completed = activity.status === "concluida";

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {categoryLabels[activity.category]}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              completed
                ? styles.completedStatusBadge
                : styles.pendingStatusBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                completed
                  ? styles.completedStatusText
                  : styles.pendingStatusText,
              ]}
            >
              {completed ? "Concluída" : "Pendente"}
            </Text>
          </View>
        </View>

        <Text
          accessibilityRole="header"
          style={styles.title}
        >
          {activity.title}
        </Text>

        {activity.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Descrição
            </Text>

            <Text style={styles.description}>
              {activity.description}
            </Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Data e horário
          </Text>

          <Text style={styles.information}>
            {activity.date}
            {activity.time
              ? ` às ${activity.time}`
              : " — horário não informado"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Categoria
          </Text>

          <Text style={styles.information}>
            {categoryLabels[activity.category]}
          </Text>
        </View>

        {completed && activity.completedAt ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>
              ✓ Atividade concluída
            </Text>

            <Text style={styles.successText}>
              Você concluiu esta atividade em{" "}
              {formatCompletedDate(activity.completedAt)}.
            </Text>
          </View>
        ) : null}
      </View>

      {errorMessage ? (
        <View
          accessibilityRole="alert"
          style={styles.errorContainer}
        >
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        </View>
      ) : null}

      {!completed ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Marcar atividade como concluída"
          accessibilityHint="Move esta atividade para o histórico"
          accessibilityState={{ disabled: processing }}
          disabled={processing}
          onPress={() => void handleComplete()}
          style={({ pressed }) => [
            styles.completeButton,
            pressed && styles.buttonPressed,
            processing && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.completeButtonText}>
            {processing
              ? "Concluindo..."
              : "Concluir atividade"}
          </Text>
        </Pressable>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Excluir atividade"
        accessibilityHint="Exclui esta atividade definitivamente"
        accessibilityState={{ disabled: processing }}
        disabled={processing}
        onPress={requestDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.buttonPressed,
          processing && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.deleteButtonText}>
          Excluir atividade
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar para lista de atividades"
        disabled={processing}
        onPress={() => router.replace("/atividades")}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.backButtonText}>
          Voltar para atividades
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function formatCompletedDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 24,
    gap: 18,
    backgroundColor: "#F5F7FA",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 24,
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    fontSize: 19,
    color: "#404040",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8A1014",
    textAlign: "center",
  },
  card: {
    gap: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "#D4D9E2",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E9EFFF",
  },
  categoryText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173F96",
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pendingStatusBadge: {
    backgroundColor: "#FFF1D6",
  },
  completedStatusBadge: {
    backgroundColor: "#DDF5E7",
  },
  statusText: {
    fontSize: 17,
    fontWeight: "800",
  },
  pendingStatusText: {
    color: "#854D0E",
  },
  completedStatusText: {
    color: "#146C43",
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    color: "#202020",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#202020",
  },
  description: {
    fontSize: 19,
    lineHeight: 29,
    color: "#404040",
  },
  information: {
    fontSize: 19,
    lineHeight: 28,
    color: "#404040",
  },
  successContainer: {
    gap: 8,
    padding: 18,
    borderWidth: 2,
    borderColor: "#18794E",
    borderRadius: 12,
    backgroundColor: "#EDFFF4",
  },
  successTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#146C43",
  },
  successText: {
    fontSize: 18,
    lineHeight: 27,
    color: "#205C3D",
  },
  errorContainer: {
    padding: 16,
    borderWidth: 2,
    borderColor: "#A4161A",
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8A1014",
  },
  primaryButton: {
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#2457C5",
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  completeButton: {
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#18794E",
  },
  completeButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  deleteButton: {
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#A4161A",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  deleteButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#A4161A",
  },
  backButton: {
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#2457C5",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2457C5",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});