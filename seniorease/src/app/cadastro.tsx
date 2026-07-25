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
  const { fontSize, colors, spacing, borderRadius, typography } = useTheme();
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
      contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { marginBottom: spacing.lg }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary, borderRadius: borderRadius.pill }]}>
          <MaterialCommunityIcons name="account-plus" size={48} color={colors.buttonText} />
        </View>
        <Text 
          accessibilityRole="header" 
          style={[
            styles.title, 
            { color: colors.text, fontSize: fontSize * 1.8, fontFamily: typography.fontFamilyBold }
          ]}
        >
          Criar Conta
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fontSize * 0.9, fontFamily: typography.fontFamilyRegular }]}>
          Preencha os dados abaixo para se cadastrar no SeniorEase.
        </Text>
      </View>

      {errorMessage ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20', borderRadius: borderRadius.md, padding: spacing.sm, marginBottom: spacing.md }]}>
          <MaterialCommunityIcons name="alert-circle" size={20} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error, fontSize: fontSize }]}>{errorMessage}</Text>
        </View>
      ) : null}

      {successMessage ? (
        <View style={[styles.successContainer, { backgroundColor: colors.success + '20', borderRadius: borderRadius.md, padding: spacing.sm, marginBottom: spacing.md }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
          <Text style={[styles.successText, { color: colors.success, fontSize: fontSize }]}>{successMessage}</Text>
        </View>
      ) : null}

      <View style={[styles.form, { gap: spacing.md }]}>
        <View style={[styles.inputGroup, { gap: spacing.xs / 2 }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize, fontFamily: typography.fontFamilyBold }]}>
            Nome Completo *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome completo"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: !name.trim() && errorMessage ? colors.error : colors.border,
                fontSize: fontSize,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontFamily: typography.fontFamilyRegular
              }
            ]}
            accessibilityLabel="Campo de Nome Completo"
          />
        </View>

        <View style={[styles.inputGroup, { gap: spacing.xs / 2 }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize, fontFamily: typography.fontFamilyBold }]}>
            E-mail *
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: !email.trim() && errorMessage ? colors.error : colors.border,
                fontSize: fontSize,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontFamily: typography.fontFamilyRegular
              }
            ]}
            accessibilityLabel="Campo de E-mail"
          />
        </View>

        <View style={[styles.inputGroup, { gap: spacing.xs / 2 }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize, fontFamily: typography.fontFamilyBold }]}>
            Senha *
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Crie uma senha segura"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: !password.trim() && errorMessage ? colors.error : colors.border,
                fontSize: fontSize,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontFamily: typography.fontFamilyRegular
              }
            ]}
            accessibilityLabel="Campo de Senha"
          />
        </View>

        <View style={[styles.inputGroup, { gap: spacing.xs / 2 }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize, fontFamily: typography.fontFamilyBold }]}>
            Confirme a Senha *
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Digite a senha novamente"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: (!confirmPassword.trim() || password !== confirmPassword) && errorMessage ? colors.error : colors.border,
                fontSize: fontSize,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontFamily: typography.fontFamilyRegular
              }
            ]}
            accessibilityLabel="Campo de Confirmação de Senha"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Finalizar Cadastro"
          onPress={handleRegister}
          style={[
            styles.button, 
            { 
              backgroundColor: colors.primary, 
              borderRadius: borderRadius.md, 
              marginTop: spacing.sm 
            }
          ]}
        >
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.buttonText} />
          <Text style={[styles.buttonText, { fontSize: fontSize * 1.1, color: colors.buttonText, fontFamily: typography.fontFamilyBold }]}>
            Cadastrar
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Voltar para o Login"
          onPress={handleNavigateToLogin}
          style={[styles.backButton, { paddingVertical: spacing.sm, marginTop: spacing.xs }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary, fontSize: fontSize, fontFamily: typography.fontFamilyBold }]}>
            Já tem uma conta? Faça login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    fontWeight: "600",
    flex: 1,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  successText: {
    fontWeight: "600",
    flex: 1,
  },
  form: {},
  inputGroup: {},
  label: {},
  input: {
    minHeight: 56,
    borderWidth: 2,
  },
  button: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    elevation: 4,
  },
  buttonText: {},
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    textAlign: 'center',
  },
});