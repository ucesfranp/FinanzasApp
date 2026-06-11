import { Alert, Platform } from 'react-native';

export const showAlert = (
    title: string,
    message: string,
    buttons?: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>
) => {
    if (Platform.OS === 'web') {
        if (buttons && buttons.length > 1) {
            const confirmed = window.confirm(`${title}\n\n${message}`);
            if (confirmed) {
                // Ejecutar el último botón del array (siempre es la acción de confirmación)
                const botonConfirmacion = buttons[buttons.length - 1];
                if (botonConfirmacion && botonConfirmacion.onPress) {
                    botonConfirmacion.onPress();
                }
            }
        } else {
            window.alert(`${title}\n${message}`);
        }
    } else {
        Alert.alert(title, message, buttons);
    }
};