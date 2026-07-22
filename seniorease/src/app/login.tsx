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


export default function LoginScreen() {
  const { fontSize, colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setErrorMessage("");
    // Redireciona para a tela inicial (index)
    router.replace("/");
  };

  const handleNavigateToRegister = () => {
    // Redireciona para a tela de cadastro (crie a rota app/cadastro.tsx se necessário)
    router.push("/cadastro");
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="shield-account" size={48} color="#FFFFFF" />
        </View>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: fontSize * 1.8 }]}>
          SeniorEase
        </Text>
        <Text style={[styles.subtitle, { color: colors.text, fontSize: fontSize * 0.9 }]}>
          Acesse sua conta para gerenciar suas tarefas com facilidade.
        </Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#A4161A" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
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
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de E-mail ou Usuário"
          />
        </View>

        <View style={styles.inputGroup}>
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
                fontSize: fontSize 
              }
            ]}
            accessibilityLabel="Campo de Senha"
          />
        </View>

        {/* Botão Principal de Entrar */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Entrar"
          onPress={handleLogin}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="login" size={24} color="#FFFFFF" />
          <Text style={[styles.buttonText, { fontSize: fontSize * 1.1 }]}>
            Entrar
          </Text>
        </Pressable>

        {/* Divisor Visual */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.text, fontSize: fontSize * 0.85 }]}>ou</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Botão Secundário de Criar Cadastro */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Botão Criar Cadastro"
          onPress={handleNavigateToRegister}
          style={[styles.secondaryButton, { borderColor: colors.primary, backgroundColor: colors.cardBackground }]}
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
    padding: 24,
    flexGrow: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
    opacity: 0.7,
  },
  secondaryButton: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    fontWeight: "bold",
  },
});