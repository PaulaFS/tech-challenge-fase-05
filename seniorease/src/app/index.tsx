import { router } from "expo-router";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const {
    settings,
    fontScale,
    spacingScale,
    colors,
  } = useAccessibility();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá!</Text>

      <Text style={styles.subtitle}>
        O que você precisa fazer hoje?
      </Text>

      <Pressable
        accessibilityRole="button"
        style={styles.primaryButton}
        onPress={() => router.push("/atividades")}
      >
        <Text style={styles.primaryButtonText}>
          Ver minhas atividades
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        style={styles.secondaryButton}
        onPress={() => router.push("/atividades/nova")}
      >
        <Text style={styles.secondaryButtonText}>
          Adicionar atividade
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        style={styles.secondaryButton}
        onPress={() => router.push("/configuracoes")}
      >
        <Text style={styles.secondaryButtonText}>
          Configurar acessibilidade
        </Text>
      </Pressable>

      <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/historico")}
      >
          <Text style={styles.secondaryButtonText}>
              Histórico
          </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#202020",
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    color: "#404040",
    marginBottom: 16,
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
    fontWeight: "700",
    color: "#FFFFFF",
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