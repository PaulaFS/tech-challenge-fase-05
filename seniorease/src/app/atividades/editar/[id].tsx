import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
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

import { MaterialCommunityIcons } from
    "@expo/vector-icons";

import {
    Montserrat_400Regular,
    Montserrat_700Bold,
    useFonts,
} from "@expo-google-fonts/montserrat";

import {
    Activity,
    ActivityCategory,
} from "@/domain/entities/Activity";

import {
    getActivityById,
    updateActivity,
} from "@/services/activityStorage";

import { useTheme } from "@/constants/theme";

const categories: Array<{
    value: ActivityCategory;
    label: string;
}> = [
        { value: "saude", label: "Saúde" },
        { value: "casa", label: "Casa" },
        { value: "estudo", label: "Estudo" },
        { value: "trabalho", label: "Trabalho" },
        {
            value: "compromisso",
            label: "Compromisso",
        },
        { value: "outros", label: "Outros" },
    ];

export default function EditActivityScreen() {
    const {
        fontSize,
        colors,
        spacing,
        borderRadius,
    } = useTheme();

    const params =
        useLocalSearchParams<{ id: string }>();

    const activityId = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const [activity, setActivity] =
        useState<Activity | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [category, setCategory] =
        useState<ActivityCategory>("saude");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [
        hasAttemptedSave,
        setHasAttemptedSave,
    ] = useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [modalVisible, setModalVisible] =
        useState(false);

    const [modalMessage, setModalMessage] =
        useState("");

    const [isSuccessModal, setIsSuccessModal] =
        useState(false);

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const loadActivity = useCallback(
        async () => {
            if (!activityId) {
                setErrorMessage("Atividade inválida.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const storedActivity =
                    await getActivityById(activityId);

                if (!storedActivity) {
                    setErrorMessage(
                        "Atividade não encontrada.",
                    );

                    setActivity(null);
                    return;
                }

                setActivity(storedActivity);

                setTitle(storedActivity.title);
                setDescription(
                    storedActivity.description,
                );
                setDate(storedActivity.date);
                setTime(storedActivity.time);
                setCategory(storedActivity.category);
            } catch {
                setErrorMessage(
                    "Não foi possível carregar a atividade.",
                );
            } finally {
                setLoading(false);
            }
        },
        [activityId],
    );

    useEffect(() => {
        void loadActivity();
    }, [loadActivity]);

    function handleDateChange(text: string) {
        let cleaned = text.replace(/\D/g, "");

        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }

        let formatted = cleaned;

        if (cleaned.length >= 5) {
            formatted =
                `${cleaned.slice(0, 2)}/` +
                `${cleaned.slice(2, 4)}/` +
                cleaned.slice(4);
        } else if (cleaned.length >= 3) {
            formatted =
                `${cleaned.slice(0, 2)}/` +
                cleaned.slice(2);
        }

        setDate(formatted);
    }

    function handleTimeChange(text: string) {
        let cleaned = text.replace(/\D/g, "");

        if (cleaned.length > 4) {
            cleaned = cleaned.slice(0, 4);
        }

        let formatted = cleaned;

        if (cleaned.length >= 3) {
            formatted =
                `${cleaned.slice(0, 2)}:` +
                cleaned.slice(2);
        }

        setTime(formatted);
    }

    function isValidDate(
        dateString: string,
    ): boolean {
        if (
            !/^\d{2}\/\d{2}\/\d{4}$/.test(
                dateString,
            )
        ) {
            return false;
        }

        const [day, month, year] =
            dateString.split("/").map(Number);

        const parsedDate = new Date(
            year,
            month - 1,
            day,
        );

        return (
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day
        );
    }

    function isFutureDate(
        dateString: string,
    ): boolean {
        if (!isValidDate(dateString)) {
            return false;
        }

        const [day, month, year] =
            dateString.split("/").map(Number);

        const inputDate = new Date(
            year,
            month - 1,
            day,
        );

        inputDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return inputDate >= today;
    }

    function isValidTime(
        timeString: string,
    ): boolean {
        if (!timeString) {
            return true;
        }

        if (
            !/^\d{2}:\d{2}$/.test(timeString)
        ) {
            return false;
        }

        const [hour, minute] =
            timeString.split(":").map(Number);

        return (
            hour >= 0 &&
            hour <= 23 &&
            minute >= 0 &&
            minute <= 59
        );
    }

    function showError(message: string) {
        setErrorMessage(message);
        setIsSuccessModal(false);
        setModalMessage(message);
        setModalVisible(true);
    }

    function validateForm(): boolean {
        if (!title.trim()) {
            showError(
                "Informe o nome da atividade.",
            );

            return false;
        }

        if (!isValidDate(date)) {
            showError(
                "Informe uma data válida no formato DD/MM/AAAA.",
            );

            return false;
        }

        if (!isFutureDate(date)) {
            showError(
                "A data informada já passou. Escolha uma data atual ou futura.",
            );

            return false;
        }

        if (!isValidTime(time)) {
            showError(
                "Informe um horário válido no formato HH:MM.",
            );

            return false;
        }

        setErrorMessage("");

        return true;
    }

    async function handleSave() {
        setHasAttemptedSave(true);

        if (
            !validateForm() ||
            !activity ||
            saving
        ) {
            return;
        }

        try {
            setSaving(true);

            const updatedActivity: Activity = {
                ...activity,
                title: title.trim(),
                description: description.trim(),
                date: date.trim(),
                time: time.trim(),
                category,
            };

            await updateActivity(
                updatedActivity,
            );

            setActivity(updatedActivity);

            setIsSuccessModal(true);

            setModalMessage(
                "A atividade foi atualizada com sucesso.",
            );

            setModalVisible(true);
        } catch {
            showError(
                "Não foi possível atualizar a atividade.",
            );
        } finally {
            setSaving(false);
        }
    }

    function handleModalClose() {
        setModalVisible(false);

        if (isSuccessModal) {
            router.back();
        }
    }

    const isTitleError =
        hasAttemptedSave && !title.trim();

    const isDateError =
        hasAttemptedSave &&
        (!isValidDate(date) ||
            !isFutureDate(date));

    const isTimeError =
        hasAttemptedSave &&
        !isValidTime(time);

    if (!fontsLoaded || loading) {
        return (
            <View
                style={[
                    styles.centerContainer,
                    {
                        backgroundColor:
                            colors.background,
                    },
                ]}
            >
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />
            </View>
        );
    }

    if (!activity) {
        return (
            <View
                style={[
                    styles.centerContainer,
                    {
                        backgroundColor:
                            colors.background,
                        padding: spacing.lg,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.errorText,
                        {
                            fontSize,
                        },
                    ]}
                >
                    {errorMessage ||
                        "Atividade não encontrada."}
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : "height"
            }
            style={{
                flex: 1,
                backgroundColor:
                    colors.background,
            }}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    {
                        padding: spacing.lg,
                        gap: spacing.md,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.title,
                        {
                            color: colors.text,
                            fontSize: fontSize * 1.6,
                        },
                    ]}
                >
                    Editar atividade
                </Text>

                <View
                    style={[
                        styles.field,
                        {
                            gap: spacing.xs,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.label,
                            {
                                color: isTitleError
                                    ? "#A4161A"
                                    : colors.text,
                                fontSize,
                            },
                        ]}
                    >
                        Título *{" "}
                        {isTitleError &&
                            "(Obrigatório)"}
                    </Text>

                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Consulta médica"
                        placeholderTextColor="#888"
                        style={[
                            styles.input,
                            {
                                backgroundColor:
                                    colors.cardBackground,
                                color: colors.text,
                                borderColor: isTitleError
                                    ? "#A4161A"
                                    : colors.border,
                                borderRadius:
                                    borderRadius.md,
                                paddingHorizontal:
                                    spacing.md,
                                fontSize,
                            },
                            isTitleError &&
                            styles.inputErrorBackground,
                        ]}
                    />
                </View>

                <View
                    style={[
                        styles.field,
                        {
                            gap: spacing.xs,
                        },
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
                                borderColor:
                                    colors.border,
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

                <View
                    style={[
                        styles.field,
                        {
                            gap: spacing.xs,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.label,
                            {
                                color: isDateError
                                    ? "#A4161A"
                                    : colors.text,
                                fontSize,
                            },
                        ]}
                    >
                        Data (DD/MM/AAAA) *{" "}
                        {isDateError &&
                            "(Inválida)"}
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
                                backgroundColor:
                                    colors.cardBackground,
                                color: colors.text,
                                borderColor: isDateError
                                    ? "#A4161A"
                                    : colors.border,
                                borderRadius:
                                    borderRadius.md,
                                paddingHorizontal:
                                    spacing.md,
                                fontSize,
                            },
                            isDateError &&
                            styles.inputErrorBackground,
                        ]}
                    />
                </View>

                <View
                    style={[
                        styles.field,
                        {
                            gap: spacing.xs,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.label,
                            {
                                color: isTimeError
                                    ? "#A4161A"
                                    : colors.text,
                                fontSize,
                            },
                        ]}
                    >
                        Horário (Opcional){" "}
                        {isTimeError &&
                            "(Inválido)"}
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
                                borderColor: isTimeError
                                    ? "#A4161A"
                                    : colors.border,
                                borderRadius:
                                    borderRadius.md,
                                paddingHorizontal:
                                    spacing.md,
                                fontSize,
                            },
                            isTimeError &&
                            styles.inputErrorBackground,
                        ]}
                    />
                </View>

                <View
                    style={[
                        styles.field,
                        {
                            gap: spacing.xs,
                        },
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
                            {
                                gap: spacing.sm,
                            },
                        ]}
                    >
                        {categories.map((item) => {
                            const selected =
                                category === item.value;

                            return (
                                <Pressable
                                    key={item.value}
                                    onPress={() =>
                                        setCategory(
                                            item.value,
                                        )
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
                                        selected && {
                                            backgroundColor:
                                                colors.primary,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            {
                                                color: selected
                                                    ? "#FFFFFF"
                                                    : colors.primary,
                                                fontSize:
                                                    fontSize * 0.9,
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor:
                                colors.primary,
                            borderRadius:
                                borderRadius.lg,
                            marginTop: spacing.sm,
                            opacity: saving ? 0.7 : 1,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.saveButtonText,
                            {
                                fontSize,
                                color: "#FFFFFF",
                            },
                        ]}
                    >
                        {saving
                            ? "Salvando..."
                            : "Salvar alterações"}
                    </Text>
                </Pressable>

                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={
                        handleModalClose
                    }
                >
                    <View
                        style={[
                            styles.modalOverlay,
                            {
                                padding: spacing.lg,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor:
                                        colors.cardBackground,
                                    borderColor:
                                        colors.border,
                                    borderRadius:
                                        borderRadius.lg,
                                    padding: spacing.lg,
                                    gap: spacing.md,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.modalHeader,
                                    {
                                        gap: spacing.sm,
                                    },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={
                                        isSuccessModal
                                            ? "check-circle-outline"
                                            : "alert-circle-outline"
                                    }
                                    size={fontSize * 2.2}
                                    color={
                                        isSuccessModal
                                            ? "#18794E"
                                            : "#A4161A"
                                    }
                                />

                                <Text
                                    style={[
                                        styles.modalTitle,
                                        {
                                            color: colors.text,
                                            fontSize:
                                                fontSize * 1.3,
                                        },
                                    ]}
                                >
                                    {isSuccessModal
                                        ? "Sucesso"
                                        : "Atenção"}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.modalMessage,
                                    {
                                        color: colors.text,
                                        fontSize,
                                    },
                                ]}
                            >
                                {modalMessage}
                            </Text>

                            <Pressable
                                style={[
                                    styles.modalButton,
                                    {
                                        backgroundColor:
                                            colors.primary,
                                        borderRadius:
                                            borderRadius.md,
                                        marginTop:
                                            spacing.xs,
                                    },
                                ]}
                                onPress={
                                    handleModalClose
                                }
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        {
                                            fontSize,
                                            color: "#FFFFFF",
                                        },
                                    ]}
                                >
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
        alignSelf: "center",
        width: "100%",
        flexGrow: 1,
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontFamily: "Montserrat_700Bold",
        textAlign: "center",
        marginBottom: 5,
    },

    field: {},

    label: {
        fontFamily: "Montserrat_700Bold",
    },

    input: {
        borderWidth: 2,
        minHeight: 52,
        fontFamily: "Montserrat_400Regular",
    },

    inputErrorBackground: {
        backgroundColor: "#FDF2F2",
    },

    textArea: {
        minHeight: 90,
        textAlignVertical: "top",
    },

    categories: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    categoryButton: {
        borderWidth: 2,
    },

    categoryText: {
        fontFamily: "Montserrat_700Bold",
    },

    saveButton: {
        minHeight: 56,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },

    saveButtonText: {
        fontFamily: "Montserrat_700Bold",
    },

    errorText: {
        fontFamily: "Montserrat_700Bold",
        color: "#A4161A",
        textAlign: "center",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        width: "100%",
        maxWidth: 400,
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    modalTitle: {
        fontFamily: "Montserrat_700Bold",
    },

    modalMessage: {
        fontFamily: "Montserrat_400Regular",
        lineHeight: 24,
    },

    modalButton: {
        minHeight: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    modalButtonText: {
        fontFamily: "Montserrat_700Bold",
    },
});