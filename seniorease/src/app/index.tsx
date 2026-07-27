import { router } from "expo-router";

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  useRef,
  useState,
} from "react";

import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";

import {
  useTheme,
} from "../constants/theme";

import {
  useAccessibility,
} from "@/contexts/AccessibilityContext";

interface HoverButtonProps {
  onPress: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
  accessibilityHint: string;
  fontSize: number;
  color: string;
  textColor: string;
  borderRadius: {
    lg: number;
  };
  spacing: {
    sm: number;
    lg: number;
  };
}

function HoverButton({
  onPress,
  icon,
  text,
  accessibilityHint,
  fontSize,
  color,
  textColor,
  borderRadius,
  spacing,
}: HoverButtonProps) {
  const scaleAnim =
    useRef(new Animated.Value(1)).current;

  const [
    isHovered,
    setIsHovered,
  ] = useState(false);

  function handleHoverIn() {
    setIsHovered(true);

    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  }

  function handleHoverOut() {
    setIsHovered(false);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={[
        styles.animatedButtonContainer,
        {
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        },
      ]}
    >
      <Pressable
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={text}
        accessibilityHint={
          accessibilityHint
        }
        style={[
          styles.button,
          {
            backgroundColor: color,
            borderRadius:
              borderRadius.lg,
            paddingHorizontal:
              spacing.lg,
            gap: spacing.sm,
          },
          isHovered && {
            opacity: 0.9,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={fontSize * 1.5}
          color={textColor}
        />

        <Text
          style={[
            styles.buttonText,
            {
              fontSize,
              color: textColor,
            },
          ]}
        >
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const {
    fontSize,
    colors,
    spacing,
    borderRadius,
  } = useTheme();

  const {
    isBasicMode,
  } = useAccessibility();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
          padding: spacing.lg,
          gap: spacing.md,
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize:
              fontSize * 2.2,
          },
        ]}
      >
        Seja bem-vindo!
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color:
              colors.textSecondary ||
              colors.text,
            fontSize:
              fontSize * 1.2,
            marginBottom:
              spacing.sm,
          },
        ]}
      >
        {isBasicMode
          ? "Escolha uma opção para continuar."
          : "O que você precisa fazer hoje?"}
      </Text>

      <HoverButton
        onPress={() =>
          router.push("/atividades")
        }
        icon="format-list-bulleted"
        text="Ver minhas atividades"
        accessibilityHint="Abre a lista das suas atividades"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
        borderRadius={borderRadius}
        spacing={spacing}
      />

      <HoverButton
        onPress={() =>
          router.push(
            "/atividades/nova",
          )
        }
        icon="plus"
        text="Adicionar atividade"
        accessibilityHint="Abre o formulário para criar uma nova atividade"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
        borderRadius={borderRadius}
        spacing={spacing}
      />

      <HoverButton
        onPress={() =>
          router.push(
            "/configuracoes",
          )
        }
        icon="cog-outline"
        text="Configurar acessibilidade"
        accessibilityHint="Abre as opções de fonte, tema e modo de interface"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
        borderRadius={borderRadius}
        spacing={spacing}
      />

      {!isBasicMode && (
        <>
          <HoverButton
            onPress={() =>
              router.push(
                "/historico",
              )
            }
            icon="history"
            text="Histórico de atividades"
            accessibilityHint="Abre a lista de atividades concluídas"
            fontSize={fontSize}
            color={colors.primary}
            textColor={
              colors.buttonText
            }
            borderRadius={
              borderRadius
            }
            spacing={spacing}
          />

          <HoverButton
            onPress={() =>
              router.push("/perfil")
            }
            icon="account-outline"
            text="Meu perfil e cadastro"
            accessibilityHint="Abre os seus dados de perfil e cadastro"
            fontSize={fontSize}
            color={colors.primary}
            textColor={
              colors.buttonText
            }
            borderRadius={
              borderRadius
            }
            spacing={spacing}
          />
        </>
      )}

      {isBasicMode && (
        <View
          style={[
            styles.basicModeMessage,
            {
              backgroundColor:
                colors.cardBackground,
              borderColor:
                colors.primary,
              borderRadius:
                borderRadius.lg,
              padding: spacing.md,
              gap: spacing.sm,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={fontSize * 1.4}
            color={colors.primary}
          />

          <Text
            style={[
              styles.basicModeMessageText,
              {
                color: colors.text,
                fontSize:
                  fontSize * 0.9,
              },
            ]}
          >
            Modo básico ativo. As opções
            menos utilizadas estão
            ocultas para facilitar a
            navegação.
          </Text>
        </View>
      )}

      <HoverButton
        onPress={() =>
          router.replace("/login")
        }
        icon="logout"
        text="Sair do aplicativo"
        accessibilityHint="Encerra a sessão e volta para a tela de login"
        fontSize={fontSize}
        color={
          colors.cardBackground ||
          "#71717A"
        }
        textColor={colors.text}
        borderRadius={borderRadius}
        spacing={spacing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },

  title: {
    fontFamily:
      "Montserrat_700Bold",
    textAlign: "center",
  },

  subtitle: {
    fontFamily:
      "Montserrat_400Regular",
    textAlign: "center",
  },

  animatedButtonContainer: {
    width: "100%",
  },

  button: {
    flexDirection: "row",
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    fontFamily:
      "Montserrat_700Bold",
    textAlign: "center",
  },

  basicModeMessage: {
    width: "100%",
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },

  basicModeMessageText: {
    flex: 1,
    fontFamily:
      "Montserrat_400Regular",
    lineHeight: 22,
  },
});