import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../constants/theme"; 

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerBackTitle: "Voltar",
        }}
      >
        <Stack.Screen name="index" options={{ title: "SeniorEase" }} />
        <Stack.Screen name="configuracoes" options={{ title: "Acessibilidade" }} />
        <Stack.Screen name="atividades/index" options={{ title: "Minhas atividades" }} />
        <Stack.Screen name="atividades/nova" options={{ title: "Nova atividade" }} />
        <Stack.Screen name="atividades/[id]" options={{ title: "Detalhes da atividade" }} />
      </Stack>
    </ThemeProvider>
  );
}

