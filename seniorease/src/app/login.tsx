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
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import { useTheme } from "../constants/theme";
import { loginUser } from "@/services/authStorage";

export default function LoginScreen() {
  const { fontSize, colors, spacing, borderRadius } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const handleLogin = async () => {
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setErrorMessage("");

    const result = await loginUser(email.trim(), password);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage(result.message);
    setTimeout(() => {
      router.replace("/"); 
    }, 1000);
  };

  const handleNavigateToRegister = () => {
    router.push("/cadastro");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { marginBottom: spacing.xl }]}>
        {/* Substituído borderRadius.full por borderRadius.pill ou 40 */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary, borderRadius: borderRadius.pill || 40 }]}>
          <MaterialCommunityIcons name="shield-account" size={48} color="#FFFFFF" />
        </View>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: fontSize * 1.8 }]}>
          SeniorEase
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary || colors.text, fontSize: fontSize * 0.9 }]}>
          Acesse sua conta para gerenciar suas tarefas com facilidade.
        </Text>
      </View>

      {errorMessage ? (
        <View style={[styles.errorContainer, { borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.sm }]}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#A4161A" />
          <Text style={[styles.errorText, { fontSize: fontSize * 0.95 }]}>{errorMessage}</Text>
        </View>
      ) : null}

      {successMessage ? (
        <View style={[styles.successContainer, { borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.sm }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#27ae60" />
          <Text style={[styles.successText, { fontSize: fontSize * 0.95 }]}>{successMessage}</Text>
        </View>
      ) : null}

      <View style={[styles.form, { gap: spacing.md }]}>
        <View style={[styles.inputGroup, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
            E-mail ou Usuário *
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
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de E-mail ou Usuário"
          />
        </View>

        <View style={[styles.inputGroup, { gap: spacing.xs }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
            Senha *
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            placeholderTextColor="#888"
            secureTextEntry
            style={[
              styles.input, 
              { 
                backgroundColor: colors.cardBackground, 
                color: colors.text, 
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de Senha"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Entrar"
          onPress={handleLogin}
          style={[
            styles.button, 
            { 
              backgroundColor: colors.primary,
              borderRadius: borderRadius.lg,
              marginTop: spacing.xs,
              gap: spacing.sm
            }
          ]}
        >
          <MaterialCommunityIcons name="login" size={24} color="#FFFFFF" />
          <Text style={[styles.buttonText, { fontSize: fontSize * 1.1 }]}>
            Entrar
          </Text>
        </Pressable>

        <View style={[styles.dividerContainer, { marginVertical: spacing.xs }]}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.text, fontSize: fontSize * 0.85, paddingHorizontal: spacing.sm }]}>ou</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Criar Cadastro"
          onPress={handleNavigateToRegister}
          style={[
            styles.secondaryButton, 
            { 
              borderColor: colors.primary, 
              backgroundColor: colors.cardBackground,
              borderRadius: borderRadius.lg,
              gap: spacing.sm
            }
          ]}
        >
          <MaterialCommunityIcons name="account-plus" size={24} color={colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: colors.primary, fontSize: fontSize * 1.1 }]}>
            Criar Cadastro
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
    fontFamily: 'Montserrat_700Bold',
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD2D2",
    marginBottom: 10,
  },
  errorText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#A4161A",
    flex: 1,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4EDDA",
    marginBottom: 10,
  },
  successText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#155724",
    flex: 1,
  },
  form: {},
  inputGroup: {},
  label: {
    fontFamily: 'Montserrat_700Bold',
  },
  input: {
    minHeight: 56,
    borderWidth: 2,
    fontFamily: 'Montserrat_400Regular',
  },
  button: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: "#FFFFFF",
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: 'Montserrat_400Regular',
    opacity: 0.7,
  },
  secondaryButton: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    fontFamily: 'Montserrat_700Bold',
  },
});