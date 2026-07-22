import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Activity, ActivityCategory } from "@/domain/entities/Activity";
import { getActivities } from "@/services/activityStorage";
import { useTheme } from "../../constants/theme";

const categoryLabels: Record<ActivityCategory, string> = {
  saude: "Saúde",
  casa: "Casa",
  estudo: "Estudo",
  trabalho: "Trabalho",
  compromisso: "Compromisso",
  outros: "Outros",
};


const HoverButton = ({ onPress, icon, text, fontSize, color, textColor }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: true }).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <Pressable 
       
        onHoverIn={handleHoverIn}
        
        onHoverOut={handleHoverOut}
        onPress={onPress}
        style={[styles.actionButton, { backgroundColor: color }, isHovered && { opacity: 0.9 }]}
        accessibilityRole="button"
        accessibilityLabel={text}
      >
        <MaterialCommunityIcons name={icon} size={fontSize * 1.4} color={textColor} />
        <Text style={[styles.actionButtonText, { fontSize: fontSize, color: textColor }]}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function ActivitiesScreen() {
  const { fontSize, colors } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const storedActivities = await getActivities();
      const pendingActivities = storedActivities.filter((activity) => activity.status === "pendente")
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
      setErrorMessage("Não foi possível carregar suas atividades.");
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
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando atividades" />
        <Text style={[styles.loadingText, { color: colors.text, fontSize: fontSize }]}>
          Carregando suas atividades...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: fontSize * 1.6 }]}>
          Minhas atividades
        </Text>
        <Text style={[styles.subtitle, { color: colors.text, fontSize: fontSize * 0.9 }]}>
          {activities.length === 0 ? "Você não possui atividades pendentes." : `${activities.length} atividade(s) pendente(s)`}
        </Text>
      </View>

      {/* Botão adicionar nova atividade */}
      <View style={styles.topButtonWrapper}>
        <HoverButton 
          onPress={() => router.push("/atividades/nova")} 
          icon="plus" 
          text="Adicionar nova atividade" 
          fontSize={fontSize}
          color={colors.primary}
          textColor={colors.buttonText}
        />
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

      {activities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={fontSize * 2.5} color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text, fontSize: fontSize }]}>
            Sua lista de pendências está vazia no momento.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activities.map((activity) => (
            <Pressable
              key={activity.id}
              accessibilityRole="button"
              accessibilityLabel={`Abrir atividade ${activity.title}`}
              onPress={() => router.push(`/atividades/${activity.id}` as any)}
              style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.categoryText, { fontSize: fontSize * 0.8 }]}>
                    {categoryLabels[activity.category]}
                  </Text>
                </View>
                <Text style={[styles.pendingStatus, { color: colors.primary, fontSize: fontSize * 0.8 }]}>Pendente</Text>
              </View>
              <Text style={[styles.activityTitle, { color: colors.text, fontSize: fontSize }]}>
                {activity.title}
              </Text>
              <Text style={[styles.activityDate, { color: colors.text, fontSize: fontSize * 0.8 }]}>
                📅 {activity.date} {activity.time ? `às ${activity.time}` : ""}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
  function convertToSortableDate(
  date: string,
  time: string,
): string {
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day} ${time || "23:59"}`;
}
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, maxWidth: 600, alignSelf: 'center', width: '100%' },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { marginTop: 12, fontWeight: '600' },
  header: { marginBottom: 15 },
  title: { fontWeight: "bold", marginBottom: 5 },
  subtitle: { opacity: 0.8 },
  topButtonWrapper: { marginBottom: 20 },
  actionButton: {
    flexDirection: "row",
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontWeight: '700',
  },
  errorText: { color: "#A4161A", fontSize: 16, marginBottom: 15, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, gap: 10 },
  emptyText: { textAlign: 'center', opacity: 0.8 },
  list: { gap: 16 },
  card: { gap: 10, padding: 18, borderWidth: 2, borderRadius: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  categoryText: { fontWeight: "700", color: "#FFFFFF" },
  pendingStatus: { fontWeight: "700" },
  activityTitle: { fontWeight: "bold" },
  activityDate: { opacity: 0.8 },
  errorContainer: {
    gap: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: "#A4161A",
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
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
});