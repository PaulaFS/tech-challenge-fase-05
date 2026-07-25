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
  const { fontSize, colors, spacing, borderRadius } = useTheme();
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
      <View style={[styles.center, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text, fontSize: fontSize * 1.1 }]}>
          Carregando histórico...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 2.2, marginBottom: spacing.xs }]}>
        Histórico de Atividades
      </Text>

      {activities.length === 0 ? (
        <View style={[styles.empty, { marginTop: spacing.xl * 2, gap: spacing.md }]}>
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
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>
              {activity.title}
            </Text>

            {activity.description ? (
              <Text style={[styles.description, { color: colors.textSecondary || colors.text, fontSize: fontSize * 1.05, opacity: 0.8 }]}>
                {activity.description}
              </Text>
            ) : null}

            <View style={[styles.infoRow, { gap: spacing.xs }]}>
              <MaterialCommunityIcons name="calendar" size={fontSize * 1.2} color={colors.primary} />
              <Text style={[styles.dateText, { color: colors.text, fontSize: fontSize }]}>
                {activity.date}
              </Text>
            </View>

            {activity.time ? (
              <View style={[styles.infoRow, { gap: spacing.xs }]}>
                <MaterialCommunityIcons name="clock-outline" size={fontSize * 1.2} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.text, fontSize: fontSize }]}>
                  {activity.time}
                </Text>
              </View>
            ) : null}

            <View style={[styles.completedContainer, { gap: spacing.xs, marginTop: spacing.xs, paddingTop: spacing.sm, borderTopColor: colors.border }]}>
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: "center",
  },
  card: {
    borderWidth: 1.5,
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
  },
  dateText: {
    fontFamily: 'Montserrat_400Regular',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  completed: {
    fontFamily: 'Montserrat_700Bold',
    color: "#18794E",
  },
});