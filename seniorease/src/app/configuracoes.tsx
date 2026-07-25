import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const FONT_SIZES = [16, 22, 30];

export default function ConfigScreen() {
  const { fontSize, setFontSize, toggleDarkMode, isDarkMode, colors, spacing, borderRadius } = useTheme();


  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });


  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <Text 
        style={[
          styles.title, 
          { 
            color: colors.text, 
            fontSize: fontSize * 1.8, 
            fontFamily: 'Montserrat_700Bold',
            marginBottom: spacing.xl 
          }
        ]}
      >
        Configurações
      </Text>
      
      <View style={[styles.section, { marginBottom: spacing.lg }]}>
        <Text 
          style={[
            styles.label, 
            { 
              color: colors.text, 
              fontSize: fontSize, 
              fontFamily: 'Montserrat_700Bold', 
              marginBottom: spacing.sm 
            }
          ]}
        >
          Tamanho da Fonte:
        </Text>
        <View style={[styles.buttonRow, { gap: spacing.sm }]}>
          {FONT_SIZES.map((size) => {
            const isSelected = fontSize === size;
            return (
              <Pressable 
                key={size}
                style={[
                  styles.sizeButton, 
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    minWidth: 70
                  }
                ]} 
                onPress={() => setFontSize(size)}
                accessibilityRole="button"
                accessibilityLabel={`Definir tamanho de fonte para ${size}`}
              >
                <Text 
                  style={{ 
                    fontSize: size, 
                    color: isSelected ? colors.buttonText : colors.text, 
                    fontFamily: 'Montserrat_700Bold' 
                  }}
                >
                  A
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Pressable 
          style={[
            styles.modeButton, 
            { 
              backgroundColor: colors.primary, 
              borderRadius: borderRadius.md, 
              padding: spacing.md,
              gap: spacing.sm 
            }
          ]} 
          onPress={toggleDarkMode}
          accessibilityRole="button"
          accessibilityLabel={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          <MaterialCommunityIcons 
            name={isDarkMode ? "weather-sunny" : "moon-waning-crescent"} 
            size={fontSize * 1.2} 
            color={colors.buttonText} 
          />
          <Text 
            style={[
              styles.buttonTextTheme, 
              { 
                color: colors.buttonText, 
                fontSize: fontSize, 
                fontFamily: 'Montserrat_700Bold' 
              }
            ]}
          >
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    maxWidth: 600, 
    alignSelf: 'center', 
    width: '100%' 
  },
  title: { 
    textAlign: 'center', 
  },
  section: { 
    alignItems: 'center', 
  },
  label: {},
  buttonRow: { 
    flexDirection: 'row', 
  },
  sizeButton: { 
    borderWidth: 2, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 2,
  },
  modeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    justifyContent: 'center',
    elevation: 3,
  },
  buttonTextTheme: {}
});