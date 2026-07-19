import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  AccessibilityProvider,
  useAccessibility,
} from "@/contexts/AccessibilityContext";

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <AppNavigator />
    </AccessibilityProvider>
  );
}

function AppNavigator() {
  const {
    loading,
    colors,
    fontScale,
    settings,
  } = useAccessibility();

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
          accessibilityLabel="Carregando configurações"
        />

        <Text
          style={[
            styles.loadingText,
            {
              color: colors.text,
              fontSize: 18 * fontScale,
            },
          ]}
        >
          Preparando o SeniorEase...
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        style={
          settings.highContrast
            ? "light"
            : "dark"
        }
      />

      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: 18 * fontScale,
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "SeniorEase" }}
        />

        <Stack.Screen
          name="atividades/index"
          options={{
            title: "Minhas atividades",
          }}
        />

        <Stack.Screen
          name="atividades/nova"
          options={{
            title: "Nova atividade",
          }}
        />

        <Stack.Screen
          name="atividades/[id]"
          options={{
            title: "Detalhes da atividade",
          }}
        />

        <Stack.Screen
          name="historico"
          options={{ title: "Histórico" }}
        />

        <Stack.Screen
          name="configuracoes"
          options={{
            title: "Acessibilidade",
          }}
        />

        <Stack.Screen
          name="perfil"
          options={{ title: "Meu perfil" }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  loadingText: {
    textAlign: "center",
  },
});