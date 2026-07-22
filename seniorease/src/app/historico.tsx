import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import { Activity } from "@/domain/entities/Activity";
import { getCompletedActivities } from "@/services/activityStorage";
import { useTheme } from "../constants/theme";

export default function HistoryScreen() {
  const { fontSize, colors } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const history = await getCompletedActivities();
    setActivities(history);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory])
  );

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text, fontSize: fontSize * 1.1 }]}>
          Carregando histórico...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 2.2 }]}>
        Histórico de Atividades
      </Text>

      {activities.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={64}
            color={colors.primary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>
            Nenhuma atividade concluída.
          </Text>
        </View>
      ) : (
        activities.map((activity) => (
          <View
            key={activity.id}
            style={[styles.card, { borderColor: colors.primary + '33' }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>
              {activity.title}
            </Text>

            {activity.description ? (
              <Text style={[styles.description, { color: colors.text, fontSize: fontSize * 1.05, opacity: 0.8 }]}>
                {activity.description}
              </Text>
            ) : null}

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={fontSize * 1.2} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.text, fontSize: fontSize }]}>
                {activity.date}
              </Text>
            </View>

            {activity.time ? (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={fontSize * 1.2} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.text, fontSize: fontSize }]}>
                  {activity.time}
                </Text>
              </View>
            ) : null}

            <View style={styles.completedContainer}>
              <MaterialCommunityIcons name="check-circle" size={fontSize * 1.2} color="#18794E" />
              <Text style={[styles.completed, { fontSize: fontSize * 0.95 }]}>
                Concluída em{" "}
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(activity.completedAt!))}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Montserrat_700Bold',
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontFamily: 'Montserrat_400Regular',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  completed: {
    fontFamily: 'Montserrat_700Bold',
    color: "#18794E",
  },
});