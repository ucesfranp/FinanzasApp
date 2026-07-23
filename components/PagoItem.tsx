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
    colores?: {
        textoPrimario: string;
        texto: string;
        inputBorder: string;
        boton: string;
    };
}

export default function PagoItem({ pago, onTogglePaid, onEliminar, colores }: Props) {
    const mostrarPagoFecha = pago.pagoFecha ? new Date(pago.pagoFecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }) : null;


    return (
        <View style={[styles.container, colores && { borderColor: colores.inputBorder }]}>
            <Pressable
                accessibilityLabel={`toggle-paid-${pago.id}`}
                onPress={() => onTogglePaid(pago)}
                style={styles.toggle}
            >
                <Text style={[styles.toggleText, { color: pago.pagado ? '#22c55e' : (colores?.boton ?? '#111827') }]}>{pago.pagado ? '✅' : '❌'}</Text>
            </Pressable>
        
            <View style={styles.info}>
                <Text style={[styles.descripcion, { color: colores?.textoPrimario }, pago.pagado && styles.tachada, pago.pagado && colores && { color: colores.texto }]}>
                    {pago.descripcion}
                </Text>
                <Text style={[styles.meta, { color: colores?.texto }]}>
                    ${pago.monto.toFixed(2)} • Vence: {pago.fechaVencimiento}
                </Text>
                {pago.pagado && mostrarPagoFecha && (
                    <Text style={styles.pagoFecha}>Pagado: {mostrarPagoFecha}hs</Text>
                )}
            </View>

            <Pressable accessibilityLabel={`delete-${pago.id}`} onPress={() => onEliminar(pago.id)} style={styles.delete}>
                <Text style={styles.deleteText}>🗑️</Text>
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
    pagoFecha: { color: '#22c55e', marginTop: 4, fontSize: 12 },
  tachada: { textDecorationLine: 'line-through', color: '#999' },
  delete: { paddingLeft: 12 },
  deleteText: { color: '#c00', fontWeight: '700' },
});