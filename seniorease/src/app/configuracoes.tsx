import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FONT_SIZES = [16, 22, 30];

export default function ConfigScreen() {
  const { fontSize, setFontSize, toggleDarkMode, isDarkMode, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 1.8 }]}>
        Configurações
      </Text>
      
      {/* Seção de Tamanho de Fonte */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>
          Tamanho da Fonte:
        </Text>
        <View style={styles.buttonRow}>
          {FONT_SIZES.map((size) => (
            <Pressable 
              key={size}
              style={[
                styles.sizeButton, 
                { backgroundColor: fontSize === size ? colors.primary : '#ccc' }
              ]} 
              onPress={() => setFontSize(size)}
              accessibilityRole="button"
              accessibilityLabel={`Definir tamanho de fonte para ${size}`}
            >
              <Text style={{ fontSize: size, color: 'white', fontWeight: 'bold' }}>A</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Seção de Modo Escuro */}
      <View style={styles.section}>
        <Pressable 
          style={[styles.modeButton, { backgroundColor: colors.primary }]} 
          onPress={toggleDarkMode}
          accessibilityRole="button"
          accessibilityLabel={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          <MaterialCommunityIcons 
            name={isDarkMode ? "weather-sunny" : "moon-waning-crescent"} 
            size={fontSize * 1.2} 
            color="white" 
          />
          <Text style={[styles.buttonText, { color: 'white', fontSize: fontSize }]}>
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', maxWidth: 600, alignSelf: 'center', width: '100%' },
  title: { textAlign: 'center', marginBottom: 40, fontWeight: 'bold' },
  section: { marginBottom: 30, alignItems: 'center' },
  label: { marginBottom: 15, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 15 },
  sizeButton: { padding: 15, borderRadius: 10, minWidth: 60, alignItems: 'center', justifyContent: 'center' },
  modeButton: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, borderRadius: 12, width: '100%', justifyContent: 'center' },
  buttonText: { fontWeight: 'bold' }
});