import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerBackTitle: "Voltar",
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "SeniorEase" }}
        />

        <Stack.Screen
          name="atividades/index"
          options={{ title: "Minhas atividades" }}
        />

        <Stack.Screen
          name="atividades/nova"
          options={{ title: "Nova atividade" }}
        />

        <Stack.Screen
          name="atividades/[id]"
          options={{ title: "Detalhes da atividade" }}
        />

        <Stack.Screen
          name="historico"
          options={{ title: "Histórico" }}
        />

        <Stack.Screen
          name="configuracoes"
          options={{ title: "Acessibilidade" }}
        />

        <Stack.Screen
          name="perfil"
          options={{ title: "Meu perfil" }}
        />
      </Stack>
    </>
  );
}