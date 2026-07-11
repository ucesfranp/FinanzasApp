import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';


export interface PagoLocal {
  id: number;
  descripcion: string;
  monto: number;
  fechaVencimiento: string;
  pagado?: boolean;
  pagoFecha?: string | null;
}

interface Props {
    pago: PagoLocal;
    onTogglePaid: (pago: PagoLocal) => void;
    onEliminar: (id: number) => void;
}

export default function PagoItem({ pago, onTogglePaid, onEliminar }: Props) {
    const mostrarPagoFecha = pago.pagoFecha ? new Date(pago.pagoFecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }) : null;


    return (
        <View style={styles.container}>
            <Pressable
                accessibilityLabel={`toggle-paid-${pago.id}`}
                onPress={() => onTogglePaid(pago)}
                style={styles.toggle}
            >
                <Text style={styles.toggleText}>{pago.pagado ? '[X]' : '[ ]'}</Text>
            </Pressable>
        
            <View style={styles.info}>
                <Text style={[styles.descripcion, pago.pagado && styles.tachada]}>
                    {pago.descripcion}
                </Text>
                <Text style={styles.meta}>
                    ${pago.monto.toFixed(2)} • Vence: {pago.fechaVencimiento}
                </Text>
                {pago.pagado && mostrarPagoFecha && (
                    <Text style={styles.pagoFecha}>Pagado: {mostrarPagoFecha}hs</Text>
                )}
            </View>

            <Pressable accessibilityLabel={`delete-${pago.id}`} onPress={() => onEliminar(pago.id)} style={styles.delete}>
                <Text style={styles.deleteText}>X</Text>
            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  toggle: { paddingRight: 12 },
  toggleText: { fontSize: 18 },
  info: { flex: 1 },
  descripcion: { fontSize: 16, fontWeight: '500' },
  meta: { color: '#666', marginTop: 4 },
  pagoFecha: { color: '#0b6', marginTop: 4, fontSize: 12 },
  tachada: { textDecorationLine: 'line-through', color: '#999' },
  delete: { paddingLeft: 12 },
  deleteText: { color: '#c00', fontWeight: '700' },
});