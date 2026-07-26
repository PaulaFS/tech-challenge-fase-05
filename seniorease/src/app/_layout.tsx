import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../constants/theme";

function RootLayoutNav() {
  const { colors, fontSize } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerBackTitle: "Voltar",
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: fontSize + 2,
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="login" options={{ title: "Entrar" }} />
      <Stack.Screen name="index" options={{ title: "SeniorEase" }} />
      <Stack.Screen name="atividades/index" options={{ title: "Minhas atividades" }} />
      <Stack.Screen name="atividades/nova" options={{ title: "Nova atividade" }} />
      <Stack.Screen name="atividades/[id]" options={{ title: "Detalhes da atividade" }} />
      <Stack.Screen name="atividades/editar/[id]" options={{ title: "Editar atividade" }} />
      <Stack.Screen name="historico" options={{ title: "Histórico" }} />
      <Stack.Screen name="configuracoes" options={{ title: "Acessibilidade" }} />
      <Stack.Screen name="perfil" options={{ title: "Meu perfil" }} />
      <Stack.Screen name="cadastro" options={{ title: "Criar Conta" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <RootLayoutNav />
    </ThemeProvider>
  );
}