import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Activity,
  ActivityCategory,
} from "@/domain/entities/Activity";
import { saveActivity } from "@/services/activityStorage";

const categories: Array<{
  value: ActivityCategory;
  label: string;
}> = [
  { value: "saude", label: "Saúde" },
  { value: "casa", label: "Casa" },
  { value: "estudo", label: "Estudo" },
  { value: "trabalho", label: "Trabalho" },
  { value: "compromisso", label: "Compromisso" },
  { value: "outros", label: "Outros" },
];

export default function NewActivityScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] =
    useState<ActivityCategory>("saude");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm(): boolean {
    if (!title.trim()) {
      setErrorMessage("Informe o nome da atividade.");
      return false;
    }

    if (!date.trim()) {
      setErrorMessage("Informe a data da atividade.");
      return false;
    }

    const validDate =
      /^\d{2}\/\d{2}\/\d{4}$/.test(date);

    if (!validDate) {
      setErrorMessage(
        "Informe a data no formato DD/MM/AAAA.",
      );
      return false;
    }

    if (time && !/^\d{2}:\d{2}$/.test(time)) {
      setErrorMessage(
        "Informe o horário no formato HH:MM.",
      );
      return false;
    }

    setErrorMessage("");
    return true;
  }

  async function handleSave() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const newActivity: Activity = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        title: title.trim(),
        description: description.trim(),
        date: date.trim(),
        time: time.trim(),
        category,
        status: "pendente",
        createdAt: new Date().toISOString(),
      };

      await saveActivity(newActivity);

      if (Platform.OS === "web") {
        window.alert(
          "Atividade cadastrada com sucesso!",
        );

        router.replace("/atividades");
        return;
      }

      Alert.alert(
        "Atividade cadastrada",
        "A atividade foi salva com sucesso.",
        [
          {
            text: "Ver atividades",
            onPress: () =>
              router.replace("/atividades"),
          },
        ],
      );
    } catch {
      setErrorMessage(
        "Não foi possível salvar a atividade. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text
            accessibilityRole="header"
            style={styles.title}
          >
            Nova atividade
          </Text>

          <Text style={styles.subtitle}>
            Preencha as informações abaixo.
          </Text>
        </View>

        {errorMessage ? (
          <View
            accessibilityRole="alert"
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>
            Nome da atividade *
          </Text>

          <TextInput
            accessibilityLabel="Nome da atividade"
            accessibilityHint="Digite o nome da atividade"
            value={title}
            onChangeText={setTitle}
            placeholder="Exemplo: Consulta médica"
            maxLength={80}
            autoCapitalize="sentences"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>

          <TextInput
            accessibilityLabel="Descrição da atividade"
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione informações importantes"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={300}
            style={[
              styles.input,
              styles.textArea,
            ]}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowField}>
            <Text style={styles.label}>Data *</Text>

            <TextInput
              accessibilityLabel="Data da atividade"
              value={date}
              onChangeText={setDate}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
            />
          </View>

          <View style={styles.rowField}>
            <Text style={styles.label}>Horário</Text>

            <TextInput
              accessibilityLabel="Horário da atividade"
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              keyboardType="numeric"
              maxLength={5}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>

          <View style={styles.categories}>
            {categories.map((item) => {
              const selected =
                category === item.value;

              return (
                <Pressable
                  key={item.value}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: selected,
                  }}
                  accessibilityLabel={`Categoria ${item.label}`}
                  onPress={() =>
                    setCategory(item.value)
                  }
                  style={[
                    styles.categoryButton,
                    selected &&
                      styles.categoryButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected &&
                        styles.categoryTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salvar atividade"
          accessibilityState={{
            disabled: loading,
          }}
          disabled={loading}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {loading
              ? "Salvando..."
              : "Salvar atividade"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar cadastro"
          disabled={loading}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.cancelButtonText}>
            Cancelar
          </Text>
        </Pressable>

        <Text style={styles.requiredText}>
          * Campos obrigatórios
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#202020",
  },
  subtitle: {
    fontSize: 19,
    lineHeight: 28,
    color: "#4A4A4A",
  },
  errorContainer: {
    padding: 16,
    borderWidth: 2,
    borderColor: "#A4161A",
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8A1014",
  },
  field: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  rowField: {
    flexGrow: 1,
    flexBasis: 220,
    gap: 8,
  },
  label: {
    fontSize: 19,
    fontWeight: "700",
    color: "#202020",
  },
  input: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#737373",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 19,
    color: "#202020",
  },
  textArea: {
    minHeight: 120,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: "#2457C5",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  categoryButtonSelected: {
    backgroundColor: "#2457C5",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2457C5",
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  saveButton: {
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#2457C5",
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cancelButton: {
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#2457C5",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2457C5",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  requiredText: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
  },
});