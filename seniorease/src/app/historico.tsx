import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Activity } from "@/domain/entities/Activity";
import { getCompletedActivities } from "@/services/activityStorage";

export default function HistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);

    const history = await getCompletedActivities();

    setActivities(history);

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Histórico
      </Text>

      {activities.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>

          <Text style={styles.emptyTitle}>
            Nenhuma atividade concluída.
          </Text>
        </View>
      ) : (
        activities.map((activity) => (
          <View
            key={activity.id}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>
              {activity.title}
            </Text>

            {activity.description ? (
              <Text style={styles.description}>
                {activity.description}
              </Text>
            ) : null}

            <Text style={styles.date}>
              📅 {activity.date}
            </Text>

            {activity.time ? (
              <Text style={styles.date}>
                🕒 {activity.time}
              </Text>
            ) : null}

            <Text style={styles.completed}>
              ✅ Concluída em{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(
                new Date(activity.completedAt!),
              )}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 18,
    backgroundColor: "#F5F7FA",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 22,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DDD",
    gap: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  description: {
    fontSize: 18,
    color: "#555",
  },

  date: {
    fontSize: 17,
    color: "#666",
  },

  completed: {
    marginTop: 8,
    fontSize: 17,
    color: "#18794E",
    fontWeight: "700",
  },
});