import { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  ScrollView 
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from "../constants/theme";
import { registerUser } from "@/services/authStorage"; 

export default function RegisterScreen() {
  const { fontSize, colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleRegister = async () => {
    setSuccessMessage("");
    
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas digitadas não coincidem. Verifique e tente novamente.");
      return;
    }

    setErrorMessage("");

  
    const result = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage(result.message);
    setTimeout(() => {
      router.push("/login");
    }, 1500); 
  };

  const handleNavigateToLogin = () => {
    router.back();
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="account-plus" size={48} color="#FFFFFF" />
        </View>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: fontSize * 1.8 }]}>
          Criar Conta
        </Text>
        <Text style={[styles.subtitle, { color: colors.text, fontSize: fontSize * 0.9 }]}>
          Preencha os dados abaixo para se cadastrar no SeniorEase.
        </Text>
      </View>

      {/* Mensagem de Erro */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#A4161A" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Mensagem de Sucesso */}
      {successMessage ? (
        <View style={styles.successContainer}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#27ae60" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
            Nome Completo *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#888"
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: colors.border,
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de Nome Completo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
            E-mail *
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: colors.border,
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de E-mail"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
            Senha *
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Crie uma senha segura"
            placeholderTextColor="#888"
            secureTextEntry
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: colors.border,
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de Senha"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
            Confirme a Senha *
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#888"
            secureTextEntry
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: colors.border,
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de Confirmação de Senha"
          />
        </View>

        {/* Botão Principal de Cadastrar */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Finalizar Cadastro"
          onPress={handleRegister}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
          <Text style={[styles.buttonText, { fontSize: fontSize * 1.1 }]}>
            Cadastrar
          </Text>
        </Pressable>

        {/* Botão para voltar ao Login */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Voltar para o Login"
          onPress={handleNavigateToLogin}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary, fontSize: fontSize }]}>
            Já tem uma conta? Faça login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD2D2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: "#A4161A",
    fontWeight: "600",
    flex: 1,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4EDDA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  successText: {
    color: "#155724",
    fontWeight: "600",
    flex: 1,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    minHeight: 56,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  button: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 5,
  },
  backButtonText: {
    fontWeight: "600",
    textAlign: 'center',
  },
});