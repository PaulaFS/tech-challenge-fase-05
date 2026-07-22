import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from "react";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import { useTheme } from "../constants/theme";

const HoverButton = ({ onPress, icon, text, fontSize, color, textColor }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <Pressable

        onHoverIn={handleHoverIn}

        onHoverOut={handleHoverOut}
        onPress={onPress}
        style={[styles.button, { backgroundColor: color }, isHovered && { opacity: 0.9 }]}
        accessibilityRole="button"
        accessibilityLabel={text}
      >
        <MaterialCommunityIcons name={icon} size={fontSize * 1.5} color={textColor} />
        <Text style={[styles.buttonText, { fontSize: fontSize, color: textColor }]}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { fontSize, colors } = useTheme();

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 2.2 }]}>
        Seja bem-vindo!
      </Text>
      <Text style={[styles.subtitle, { color: colors.text, fontSize: fontSize * 1.2 }]}>
        O que você precisa fazer hoje?
      </Text>

      <HoverButton
        onPress={() => router.push("/atividades")}
        icon="pencil-outline"
        text="Ver minhas atividades"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
      />
      <HoverButton
        onPress={() => router.push("/atividades/nova")}
        icon="plus"
        text="Adicionar atividade"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
      />
      <HoverButton
        onPress={() => router.push("/configuracoes")}
        icon="cog-outline"
        text="Configurar acessibilidade"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
      />
      <HoverButton
        onPress={() => router.push("/historico")}
        icon="cog-outline"
        text="Histórico de atividades"
        fontSize={fontSize}
        color={colors.primary}
        textColor={colors.buttonText}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginBottom: 10
  },
  button: {
    flexDirection: "row",
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
  },
});