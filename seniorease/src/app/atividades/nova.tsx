import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Activity, ActivityCategory } from "@/domain/entities/Activity";
import { saveActivity } from "@/services/activityStorage";
import { getLoggedUser } from "@/services/authStorage";
import { useTheme } from "../../constants/theme";
import {
  useAccessibility,
} from "@/contexts/AccessibilityContext";

const categories: Array<{ value: ActivityCategory; label: string }> = [
  { value: "saude", label: "Saúde" },
  { value: "casa", label: "Casa" },
  { value: "estudo", label: "Estudo" },
  { value: "trabalho", label: "Trabalho" },
  { value: "compromisso", label: "Compromisso" },
  { value: "outros", label: "Outros" },
];

export default function NewActivityScreen() {
  const { fontSize, colors, spacing, borderRadius } = useTheme();
  const { isBasicMode } =
    useAccessibility();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("outros");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  function handleDateChange(text: string) {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = cleaned;
    if (cleaned.length >= 5) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }

    setDate(formatted);
  }

  function handleTimeChange(text: string) {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);

    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }

    setTime(formatted);
  }

  function isFutureDate(dateString: string): boolean {
    const parts = dateString.split("/");
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const inputDate = new Date(year, month, day);
    if (isNaN(inputDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today;
  }

  function validateForm(): boolean {
    if (!title.trim()) {
      const msg = "Informe o nome da atividade.";
      setErrorMessage(msg);
      setIsSuccessModal(false);
      setModalMessage(msg);
      setModalVisible(true);
      return false;
    }
    if (!date.trim() || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const msg = "Informe a data completa no formato DD/MM/AAAA.";
      setErrorMessage(msg);
      setIsSuccessModal(false);
      setModalMessage(msg);
      setModalVisible(true);
      return false;
    }

    if (!isFutureDate(date)) {
      const msg = "A data informada já passou. Por favor, escolha uma data futura.";
      setErrorMessage(msg);
      setIsSuccessModal(false);
      setModalMessage(msg);
      setModalVisible(true);
      return false;
    }

    setErrorMessage("");
    return true;
  }

  async function handleSave() {
    setHasAttemptedSave(true);
    if (!validateForm()) return;

    try {
      setLoading(true);

      const currentUser = await getLoggedUser();
      const userId = currentUser ? currentUser.id : "default-user";

      const newActivity: Activity = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId,
        title: title.trim(),
        description: description.trim(),
        date: date.trim(),
        time: time.trim(),
        category,
        status: "pendente",
        createdAt: new Date().toISOString(),
      };

      await saveActivity(newActivity);

      setIsSuccessModal(true);
      setModalMessage("A atividade foi salva com sucesso.");
      setModalVisible(true);
    } catch {
      setErrorMessage("Não foi possível salvar a atividade.");
      setIsSuccessModal(false);
      setModalMessage("Não foi possível salvar a atividade.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  }

  function handleModalClose() {
    setModalVisible(false);
    if (isSuccessModal) {
      router.replace("/atividades");
    }
  }

  const isTitleError = hasAttemptedSave && !title.trim();
  const isDateError = hasAttemptedSave && (!date.trim() || !/^\d{2}\/\d{2}\/\d{4}$/.test(date) || !isFutureDate(date));

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg, gap: spacing.md }]}>
        <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 1.6 }]}>Nova Atividade</Text>

        {isBasicMode && (
          <View
            style={[
              styles.basicModeMessage,
              {
                backgroundColor:
                  colors.cardBackground,
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={fontSize * 1.5}
              color={colors.primary}
            />

            <Text
              style={[
                styles.basicModeMessageText,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              Preencha o nome e a data da
              atividade. Essas são as informações
              necessárias para continuar.
            </Text>
          </View>
        )}

        <View style={[styles.field, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: isTitleError ? "#A4161A" : colors.text, fontSize: fontSize }]}>
            Título * {isTitleError && "(Obrigatório)"}
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Consulta médica"
            placeholderTextColor="#888"
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: isTitleError ? "#A4161A" : colors.border,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize
              },
              isTitleError && styles.inputErrorBackground
            ]}
          />
        </View>

        {!isBasicMode && (
          <View
            style={[
              styles.field,
              { gap: spacing.xs },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              Descrição (Opcional)
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Detalhes ou anotações importantes..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor:
                    colors.cardBackground,
                  color: colors.text,
                  borderColor: colors.border,
                  borderRadius:
                    borderRadius.md,
                  paddingHorizontal:
                    spacing.md,
                  paddingVertical:
                    spacing.sm,
                  fontSize,
                },
              ]}
            />
          </View>
        )}

        <View style={[styles.field, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: isDateError ? "#A4161A" : colors.text, fontSize: fontSize }]}>
            Data (DD/MM/AAAA) * {isDateError && "(Inválida ou vazia)"}
          </Text>
          <TextInput
            value={date}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={10}
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: isDateError ? "#A4161A" : colors.border,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize
              },
              isDateError && styles.inputErrorBackground
            ]}
          />
        </View>

        {!isBasicMode && (
          <View
            style={[
              styles.field,
              { gap: spacing.xs },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              Horário (Opcional)
            </Text>

            <TextInput
              value={time}
              onChangeText={handleTimeChange}
              placeholder="HH:MM"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={5}
              style={[
                styles.input,
                {
                  backgroundColor:
                    colors.cardBackground,
                  color: colors.text,
                  borderColor: colors.border,
                  borderRadius:
                    borderRadius.md,
                  paddingHorizontal:
                    spacing.md,
                  fontSize,
                },
              ]}
            />
          </View>
        )}

        {!isBasicMode && (
          <View
            style={[
              styles.field,
              { gap: spacing.xs },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize,
                },
              ]}
            >
              Categoria
            </Text>

            <View
              style={[
                styles.categories,
                { gap: spacing.sm },
              ]}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.value}
                  onPress={() =>
                    setCategory(cat.value)
                  }
                  style={[
                    styles.categoryButton,
                    {
                      borderColor:
                        colors.primary,
                      borderRadius:
                        borderRadius.md,
                      paddingHorizontal:
                        spacing.md,
                      paddingVertical:
                        spacing.sm,
                    },
                    category === cat.value && {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: colors.primary,
                        fontSize:
                          fontSize * 0.9,
                      },
                      category ===
                      cat.value && {
                        color: "#FFFFFF",
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={[
            styles.saveButton,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.lg,
              marginTop: spacing.sm
            }
          ]}
        >
          <Text style={[styles.saveButtonText, { fontSize: fontSize, color: "#FFFFFF" }]}>
            {loading ? "Salvando..." : "Salvar Atividade"}
          </Text>
        </Pressable>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose}
        >
          <View style={[styles.modalOverlay, { padding: spacing.lg }]}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  gap: spacing.md
                }
              ]}
            >
              <View style={[styles.modalHeader, { gap: spacing.sm }]}>
                <MaterialCommunityIcons
                  name={isSuccessModal ? "check-circle-outline" : "alert-circle-outline"}
                  size={fontSize * 2.2}
                  color={isSuccessModal ? "#18794E" : "#A4161A"}
                />
                <Text style={[styles.modalTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>
                  {isSuccessModal ? "Sucesso" : "Atenção"}
                </Text>
              </View>

              <Text style={[styles.modalMessage, { color: colors.text, fontSize: fontSize }]}>
                {modalMessage}
              </Text>

              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.md,
                    marginTop: spacing.xs
                  }
                ]}
                onPress={handleModalClose}
              >
                <Text style={[styles.modalButtonText, { fontSize: fontSize, color: "#FFFFFF" }]}>
                  Entendi
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: "center",
    marginBottom: 5,
  },
  field: {},
  label: {
    fontFamily: 'Montserrat_700Bold',
  },
  input: {
    borderWidth: 2,
    minHeight: 52,
    fontFamily: 'Montserrat_400Regular',
  },
  inputErrorBackground: {
    backgroundColor: '#FDF2F2'
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top'
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    borderWidth: 2,
  },
  categoryText: {
    fontFamily: 'Montserrat_700Bold',
  },
  saveButton: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  saveButtonText: {
    fontFamily: 'Montserrat_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: 'Montserrat_700Bold',
  },
  modalMessage: {
    fontFamily: 'Montserrat_400Regular',
    lineHeight: 24,
  },
  modalButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontFamily: 'Montserrat_700Bold',
  },

  basicModeMessage: {
    width: "100%",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  basicModeMessageText: {
    flex: 1,
    fontFamily: "Montserrat_400Regular",
    lineHeight: 24,
  },
});