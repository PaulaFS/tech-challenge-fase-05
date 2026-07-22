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
import { Activity, ActivityCategory } from "@/domain/entities/Activity";
import { completeActivity, deleteActivity, getActivityById } from "@/services/activityStorage";
import { useTheme } from "../../constants/theme";

const categoryLabels: Record<ActivityCategory, string> = {
  saude: "Saúde",
  casa: "Casa",
  estudo: "Estudo",
  trabalho: "Trabalho",
  compromisso: "Compromisso",
  outros: "Outros",
};

export default function ActivityDetailsScreen() {
  const { fontSize, colors } = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    void loadActivity();
  }, [loadActivity]);

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

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { fontSize: fontSize }]}>{errorMessage || "Atividade não encontrada."}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 1.5 }]}>{activity.title}</Text>
        
        <Text style={[styles.label, { color: colors.text, fontSize: fontSize * 0.9 }]}>
          Categoria: <Text style={{ fontWeight: 'bold' }}>{categoryLabels[activity.category]}</Text>
        </Text>
        
        <Text style={[styles.label, { color: colors.text, fontSize: fontSize * 0.9 }]}>
          Data: <Text style={{ fontWeight: 'bold' }}>{activity.date} {activity.time ? `às ${activity.time}` : ""}</Text>
        </Text>

        {activity.description ? (
          <Text style={[styles.description, { color: colors.text, fontSize: fontSize }]}>{activity.description}</Text>
        ) : null}

        <Text style={[styles.status, { color: activity.status === 'concluida' ? '#18794E' : colors.primary, fontSize: fontSize }]}>
          Status: {activity.status.toUpperCase()}
        </Text>
      </View>

      {activity.status === "pendente" && (
        <Pressable onPress={handleComplete} style={styles.completeButton}>
          <Text style={[styles.buttonText, { fontSize: fontSize }]}>Concluir Atividade</Text>
        </Pressable>
      )}

      <Pressable onPress={requestDelete} style={styles.deleteButton}>
        <Text style={[styles.deleteButtonText, { fontSize: fontSize }]}>Excluir Atividade</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, maxWidth: 600, alignSelf: 'center', width: '100%', flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: { padding: 20, borderWidth: 2, borderRadius: 16, gap: 12 },
  title: { fontWeight: "bold" },
  label: { opacity: 0.8 },
  description: { marginTop: 10 },
  status: { fontWeight: "bold", marginTop: 5 },
  completeButton: { minHeight: 56, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#18794E" },
  deleteButton: { minHeight: 56, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 2, borderColor: "#A4161A", backgroundColor: "#FFFFFF" },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
  deleteButtonText: { color: "#A4161A", fontWeight: "bold" },
  errorText: { color: "#A4161A", textAlign: "center" }
});