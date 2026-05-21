// Cada clave = nombre de una pantalla
// El valor = parametros que recibe
export type RootStackParamList = {
    Home: undefined; // no recibe nada
    Detalle: { // recibe nombre y nota
        nombre: string;
        nota: number;
    };
    Ajustes: undefined;
};