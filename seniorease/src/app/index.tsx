import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SeniorEase</Text>

      <Text style={styles.subtitle}>
        Organizador de atividades para idosos
      </Text>

      <Button
        title="Minhas atividades"
        onPress={() => router.push("/atividades")}
      />

      <View style={{ height: 16 }} />

      <Button
        title="Configurações"
        onPress={() => router.push("/configuracoes")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 32,
  },
});