import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
import { getActivities } from "@/services/activityStorage";

const categoryLabels: Record<ActivityCategory, string> = {
  saude: "Saúde",
  casa: "Casa",
  estudo: "Estudo",
  trabalho: "Trabalho",
  compromisso: "Compromisso",
  outros: "Outros",
};

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const storedActivities = await getActivities();

      const pendingActivities = storedActivities
        .filter((activity) => activity.status === "pendente")
        .sort((firstActivity, secondActivity) => {
          const firstDate = convertToSortableDate(
            firstActivity.date,
            firstActivity.time,
          );

          const secondDate = convertToSortableDate(
            secondActivity.date,
            secondActivity.time,
          );

          return firstDate.localeCompare(secondDate);
        });

      setActivities(pendingActivities);
    } catch {
      setErrorMessage(
        "Não foi possível carregar suas atividades.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadActivities();
    }, [loadActivities]),
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          accessibilityLabel="Carregando atividades"
        />

        <Text style={styles.loadingText}>
          Carregando suas atividades...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text
            accessibilityRole="header"
            style={styles.title}
          >
            Minhas atividades
          </Text>

          <Text style={styles.subtitle}>
            {activities.length === 0
              ? "Você não possui atividades pendentes."
              : `${activities.length} ${
                  activities.length === 1
                    ? "atividade pendente"
                    : "atividades pendentes"
                }`}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar nova atividade"
          onPress={() => router.push("/atividades/nova")}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>
            + Nova atividade
          </Text>
        </Pressable>

        <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/historico")}
        >
            <Text style={styles.secondaryButtonText}>
                Ver histórico
            </Text>
        </Pressable>

      </View>

      {errorMessage ? (
        <View
          accessibilityRole="alert"
          style={styles.errorContainer}
        >
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => void loadActivities()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!errorMessage && activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✓</Text>

          <Text style={styles.emptyTitle}>
            Tudo organizado!
          </Text>

          <Text style={styles.emptyDescription}>
            Cadastre uma atividade para começar a organizar
            sua rotina.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cadastrar primeira atividade"
            onPress={() =>
              router.push("/atividades/nova")
            }
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              Cadastrar atividade
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.list}>
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={() =>
              router.push({
                pathname: "/atividades/[id]",
                params: { id: activity.id },
              })
            }
          />
        ))}
      </View>

      
    </ScrollView>
  );
}

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
}

function ActivityCard({
  activity,
  onPress,
}: ActivityCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir atividade ${activity.title}`}
      accessibilityHint="Mostra os detalhes desta atividade"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categoryLabels[activity.category]}
          </Text>
        </View>

        <Text style={styles.pendingStatus}>
          Pendente
        </Text>
      </View>

      <Text style={styles.activityTitle}>
        {activity.title}
      </Text>

      {activity.description ? (
        <Text
          style={styles.activityDescription}
          numberOfLines={2}
        >
          {activity.description}
        </Text>
      ) : null}

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Data:</Text>

        <Text style={styles.dateValue}>
          {activity.date}
          {activity.time ? ` às ${activity.time}` : ""}
        </Text>
      </View>

      <Text style={styles.openText}>
        Toque para ver os detalhes
      </Text>
    </Pressable>
  );
}

function convertToSortableDate(
  date: string,
  time: string,
): string {
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day} ${time || "23:59"}`;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 24,
    gap: 24,
    backgroundColor: "#F5F7FA",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    fontSize: 19,
    color: "#404040",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  headerText: {
    flexGrow: 1,
    gap: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#202020",
  },
  subtitle: {
    fontSize: 19,
    lineHeight: 27,
    color: "#4A4A4A",
  },
  addButton: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2457C5",
  },
  addButtonText: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  errorContainer: {
    gap: 16,
    padding: 18,
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
  retryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#A4161A",
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    gap: 14,
    padding: 32,
    borderWidth: 2,
    borderColor: "#D4D9E2",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  emptyIcon: {
    fontSize: 46,
    fontWeight: "800",
    color: "#18794E",
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#202020",
    textAlign: "center",
  },
  emptyDescription: {
    maxWidth: 520,
    fontSize: 19,
    lineHeight: 28,
    color: "#4A4A4A",
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 58,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#2457C5",
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  list: {
    gap: 18,
  },
  card: {
    gap: 14,
    padding: 20,
    borderWidth: 2,
    borderColor: "#D4D9E2",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  cardPressed: {
    opacity: 0.75,
    borderColor: "#2457C5",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#E9EFFF",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#173F96",
  },
  pendingStatus: {
    fontSize: 17,
    fontWeight: "700",
    color: "#8A4B08",
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#202020",
  },
  activityDescription: {
    fontSize: 18,
    lineHeight: 26,
    color: "#4A4A4A",
  },
  dateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202020",
  },
  dateValue: {
    fontSize: 18,
    color: "#404040",
  },
  openText: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: "700",
    color: "#2457C5",
  },
  secondaryButton: {
    minHeight: 58,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#2457C5",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2457C5",
  },
});