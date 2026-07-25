import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/data/storage/storageKeys";
import { getLoggedUser, User, getUsers } from "@/services/authStorage";
import { useTheme } from "../constants/theme";

export default function ProfileScreen() {
  const { fontSize, colors, spacing, borderRadius } = useTheme();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    async function loadUserData() {
      const currentUser = await getLoggedUser();
      if (currentUser) {
        setName(currentUser.name);
        setEmail(currentUser.email);
        setPassword(currentUser.password);
      }
    }
    void loadUserData();
  }, []);

  function validateForm(): boolean {
    if (!name.trim() || !email.trim() || !password.trim()) {
      const msg = "Todos os campos (Nome, E-mail e Senha) são obrigatórios.";
      setIsSuccessModal(false);
      setModalMessage(msg);
      setModalVisible(true);
      return false;
    }
    return true;
  }

  async function handleUpdateProfile() {
    setHasAttemptedSave(true);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const currentUser = await getLoggedUser();
      if (!currentUser) {
        setModalMessage("Nenhum usuário logado no momento.");
        setIsSuccessModal(false);
        setModalVisible(true);
        return;
      }

      const users = await getUsers();

      const emailAlreadyExists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== currentUser.id
      );

      if (emailAlreadyExists) {
        setModalMessage("Este e-mail já está em uso por outra conta.");
        setIsSuccessModal(false);
        setModalVisible(true);
        setLoading(false);
        return;
      }

      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          };
        }
        return u;
      });

      await AsyncStorage.setItem(STORAGE_KEYS.users, JSON.stringify(updatedUsers));

      const updatedLoggedUser: User = {
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.loggedUser, JSON.stringify(updatedLoggedUser));

      setIsSuccessModal(true);
      setModalMessage("Dados do perfil atualizados com sucesso!");
      setModalVisible(true);
    } catch {
      setIsSuccessModal(false);
      setModalMessage("Não foi possível atualizar o perfil.");
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

  const isNameError = hasAttemptedSave && !name.trim();
  const isEmailError = hasAttemptedSave && !email.trim();
  const isPasswordError = hasAttemptedSave && !password.trim();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { padding: spacing.lg, gap: spacing.md }]}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-edit-outline" size={fontSize * 2.5} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 1.6 }]}>Meu Perfil</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary || colors.text, fontSize: fontSize * 0.9 }]}>
            Atualize suas informações de cadastro abaixo.
          </Text>
        </View>

        <View style={[styles.field, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: isNameError ? "#A4161A" : colors.text, fontSize: fontSize }]}>
            Nome Completo * {isNameError && "(Obrigatório)"}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#888"
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: isNameError ? "#A4161A" : colors.border, 
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize 
              },
              isNameError && styles.inputErrorBackground
            ]}
          />
        </View>

        <View style={[styles.field, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: isEmailError ? "#A4161A" : colors.text, fontSize: fontSize }]}>
            E-mail * {isEmailError && "(Obrigatório)"}
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: isEmailError ? "#A4161A" : colors.border, 
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize 
              },
              isEmailError && styles.inputErrorBackground
            ]}
          />
        </View>

        <View style={[styles.field, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: isPasswordError ? "#A4161A" : colors.text, fontSize: fontSize }]}>
            Senha * {isPasswordError && "(Obrigatório)"}
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            placeholderTextColor="#888"
            secureTextEntry
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: isPasswordError ? "#A4161A" : colors.border, 
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize 
              },
              isPasswordError && styles.inputErrorBackground
            ]}
          />
        </View>

        <Pressable
          onPress={handleUpdateProfile}
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
            {loading ? "Salvando..." : "Salvar Alterações"}
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
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  title: { 
    fontFamily: 'Montserrat_700Bold', 
    textAlign: "center", 
    marginTop: 5,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    opacity: 0.8,
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
});