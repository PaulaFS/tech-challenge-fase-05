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
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
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

const HoverButton = ({ onPress, icon, text, fontSize, color, textColor, borderRadius, spacing }: any) => {
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
        style={[
          styles.actionButton, 
          { 
            backgroundColor: color, 
            borderRadius: borderRadius.lg,
            paddingHorizontal: spacing.lg,
            gap: spacing.sm
          }, 
          isHovered && { opacity: 0.9 }
        ]}
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
  const { fontSize, colors, spacing, borderRadius } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

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

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando atividades" />
        <Text style={[styles.loadingText, { color: colors.text, fontSize: fontSize }]}>
          Carregando suas atividades...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { marginBottom: spacing.xs }]}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: fontSize * 1.6 }]}>
          Minhas atividades
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary || colors.text, fontSize: fontSize * 0.9 }]}>
          {activities.length === 0 ? "Você não possui atividades pendentes." : `${activities.length} atividade(s) pendente(s)`}
        </Text>
      </View>

      <View style={{ marginBottom: spacing.xs }}>
        <HoverButton
          onPress={() => router.push("/atividades/nova")}
          icon="plus"
          text="Adicionar nova atividade"
          fontSize={fontSize}
          color={colors.primary}
          textColor={colors.buttonText}
          borderRadius={borderRadius}
          spacing={spacing}
        />
      </View>
      
      <View style={{ marginBottom: spacing.sm }}>
        <HoverButton
          onPress={() => router.push("/historico")}
          icon="history"
          text="Ver histórico de atividades"
          fontSize={fontSize}
          color={colors.primary}
          textColor={colors.buttonText}
          borderRadius={borderRadius}
          spacing={spacing}
        />
      </View>

      {errorMessage ? (
        <View
          accessibilityRole="alert"
          style={[
            styles.errorContainer,
            {
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              gap: spacing.md,
            }
          ]}
        >
          <Text style={[styles.errorText, { fontSize: fontSize }]}>
            {errorMessage}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar atividades novamente"
            onPress={() => void loadActivities()}
            style={[styles.retryButton, { borderRadius: borderRadius.md }]}
          >
            <Text style={[styles.retryButtonText, { fontSize: fontSize * 1.1 }]}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : null}

      {activities.length === 0 ? (
        <View style={[styles.emptyContainer, { marginVertical: spacing.xl, gap: spacing.md }]}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={fontSize * 2.5} color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary || colors.text, fontSize: fontSize }]}>
            Sua lista de pendências está vazia no momento.
          </Text>
        </View>
      ) : (
        <View style={[styles.list, { gap: spacing.md }]}>
          {activities.map((activity) => (
            <Pressable
              key={activity.id}
              accessibilityRole="button"
              accessibilityLabel={`Abrir atividade ${activity.title}`}
              onPress={() => router.push(`/atividades/${activity.id}` as any)}
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
              <View style={styles.cardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }]}>
                  <Text style={[styles.categoryText, { fontSize: fontSize * 0.8 }]}>
                    {categoryLabels[activity.category]}
                  </Text>
                </View>
                <Text style={[styles.pendingStatus, { color: colors.primary, fontSize: fontSize * 0.8 }]}>Pendente</Text>
              </View>
              <Text style={[styles.activityTitle, { color: colors.text, fontSize: fontSize }]}>
                {activity.title}
              </Text>
              <Text style={[styles.activityDate, { color: colors.textSecondary || colors.text, fontSize: fontSize * 0.8 }]}>
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
  container: { 
    flexGrow: 1, 
    maxWidth: 600, 
    alignSelf: 'center', 
    width: '100%' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
  },
  loadingText: { 
    fontFamily: 'Montserrat_700Bold',
    marginTop: 12, 
  },
  header: {},
  title: { 
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 5, 
  },
  subtitle: { 
    fontFamily: 'Montserrat_400Regular',
    opacity: 0.8, 
  },
  actionButton: {
    flexDirection: "row",
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: 'Montserrat_700Bold',
  },
  errorText: { 
    fontFamily: 'Montserrat_700Bold',
    color: "#A4161A", 
    textAlign: 'center', 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  emptyText: { 
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center', 
  },
  list: {},
  card: { 
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
  },
  categoryBadge: {},
  categoryText: { 
    fontFamily: 'Montserrat_700Bold', 
    color: "#FFFFFF", 
  },
  pendingStatus: { 
    fontFamily: 'Montserrat_700Bold', 
  },
  activityTitle: { 
    fontFamily: 'Montserrat_700Bold', 
  },
  activityDate: { 
    fontFamily: 'Montserrat_400Regular',
    opacity: 0.8, 
  },
  errorContainer: {
    borderWidth: 2,
    borderColor: "#A4161A",
    backgroundColor: "#FFF0F0",
  },
  retryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A4161A",
  },
  retryButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#FFFFFF",
  },
});