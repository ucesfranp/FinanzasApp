import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../context/TemaContext';
import { useFinanzas } from '../context/FinanzasContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackParamList = {
    HomeFinanzas: undefined;
    DetalleTransaccion: { transaccionId: number };
    AgregarTransaccion: undefined;
};

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeFinanzas'>;

interface Props {
    navigation: NavigationProp;
}

export default function HomeFinanzasScreen({ navigation }: Props) {
    const { colores } = useTema();
    const { transacciones, presupuesto, obtenerResumen } = useFinanzas();

    const ahora = new Date();
    const mes = ahora.getMonth();
    const año = ahora.getFullYear();
    const resumen = obtenerResumen(mes, año);

    const ultimos5 = transacciones.slice(0, 5);

    const porcentajeColor = resumen.disponible < 0 ? '#FF6B6B' : resumen.disponible < presupuesto * 0.2 ? '#FFE66D' : '#4ECDC4';

    return (
        <ScrollView style={[styles.container, { backgroundColor: colores.fondo }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.titulo, { color: colores.textoPrimario }]}>Mi Dinero</Text>
                <Pressable 
                    style={[styles.botonFlotante, { backgroundColor: colores.boton }]}
                    onPress={() => navigation.navigate('AgregarTransaccion')}
                >
                    <Ionicons name="add" size={24} color="white" />
                </Pressable>
            </View>

            {/* Tarjeta principal - Disponible */}
            <View style={[styles.tarjetaPrincipal, { backgroundColor: porcentajeColor }]}>
                <Text style={styles.etiqueta}>Disponible este mes</Text>
                <Text style={styles.monto}>${resumen.disponible.toFixed(2)}</Text>
                <Text style={styles.subTexto}>
                    Presupuesto: ${resumen.presupuesto.toFixed(2)}
                </Text>
            </View>

            {/* Alerta si supera presupuesto */}
            {resumen.disponible < 0 && (
                <View style={[styles.alerta, { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: '#FF6B6B' }]}>
                    <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                    <Text style={[styles.alertaTexto, { color: '#FF6B6B' }]}>
                        ⚠️ ¡Has superado tu presupuesto!
                    </Text>
                </View>
            )}

            {/* Resumen del mes */}
            <View style={[styles.seccion, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}>
                <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Resumen de Mes</Text>
                
                <View style={styles.resumenGrid}>
                    <View style={styles.resumenItem}>
                        <Text style={[styles.resumenLabel, { color: colores.texto }]}>Ingresos</Text>
                        <Text style={[styles.resumenMonto, { color: '#4ECDC4' }]}>
                            +${resumen.totalIngresos.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.resumenItem}>
                        <Text style={[styles.resumenLabel, { color: colores.texto }]}>Gastos</Text>
                        <Text style={[styles.resumenMonto, { color: '#FF6B6B' }]}>
                            -${resumen.totalGastos.toFixed(2)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.progressBar, { backgroundColor: colores.inputBorder }]}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: `${Math.min(resumen.porcentajeUsado, 100)}%`,
                                backgroundColor: resumen.porcentajeUsado > 100 ? '#FF6B6B' : '#4ECDC4'
                            }
                        ]}
                    />
                </View>
                <Text style={[styles.progressTexto, { color: colores.texto }]}>
                    {resumen.porcentajeUsado.toFixed(1)}% del presupuesto usado
                </Text>
            </View>

            {/* Últimos movimientos */}
            <View style={styles.seccion}>
                <Text style={[styles.tituloSeccion, { color: colores.textoPrimario }]}>Últimos Movimientos</Text>
                
                {ultimos5.length === 0 ? (
                    <Text style={[styles.textoVacio, { color: colores.texto }]}>No hay movimientos este mes</Text>
                ) : (
                    ultimos5.map((transaccion) => (
                        <Pressable 
                            key={transaccion.id}
                            style={[styles.movimiento, { backgroundColor: colores.inputBg, borderColor: colores.inputBorder }]}
                            onPress={() => navigation.navigate('DetalleTransaccion', { transaccionId: transaccion.id })}
                        >
                            <View style={styles.movimientoInfo}>
                                <Text style={[styles.movimientoDesc, { color: colores.texto }]}>
                                    {transaccion.descripcion}
                                </Text>
                                <Text style={[styles.movimientoFecha, { color: colores.texto, opacity: 0.6 }]}>
                                    {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                                </Text>
                            </View>
                            <Text style={[
                                styles.movimientoMonto,
                                { color: transaccion.tipo === 'ingreso' ? '#4ECDC4' : '#FF6B6B' }
                            ]}>
                                {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toFixed(2)}
                            </Text>
                        </Pressable>
                    ))
                )}
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    botonFlotante: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tarjetaPrincipal: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    etiqueta: {
        color: 'white',
        fontSize: 14,
        opacity: 0.8,
    },
    monto: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    subTexto: {
        color: 'white',
        fontSize: 12,
        opacity: 0.7,
    },
    alerta: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
    },
    alertaTexto: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    seccion: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tituloSeccion: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    resumenGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    resumenItem: {
        alignItems: 'center',
    },
    resumenLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    resumenMonto: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressTexto: {
        fontSize: 12,
        textAlign: 'right',
    },
    textoVacio: {
        textAlign: 'center',
        fontSize: 14,
        marginVertical: 20,
    },
    movimiento: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    movimientoInfo: {
        flex: 1,
    },
    movimientoDesc: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    movimientoFecha: {
        fontSize: 12,
    },
    movimientoMonto: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
