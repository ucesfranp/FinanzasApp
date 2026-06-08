import { Alert, Platform } from 'react-native';

export const showAlert = (
    title: string,
    message: string,
    buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>
) => {
    if (Platform.OS === 'web') {
        // En web, usar confirm o alert nativo
        if (buttons && buttons.length > 1) {
            const confirmed = window.confirm(`${title}\n\n${message}`);
            if (confirmed) {
                // Buscar el botón "Eliminar" o el segundo botón y ejecutarlo
                const eliminarBtn = buttons.find(b => b.text.toLowerCase() === 'eliminar');
                if (eliminarBtn && eliminarBtn.onPress) {
                    eliminarBtn.onPress();
                }
            }
        } else {
            window.alert(`${title}\n${message}`);
        }
    } else {
        // En mobile, usar Alert.alert normal
        Alert.alert(title, message, buttons);
    }
};
