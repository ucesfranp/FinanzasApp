// Cada clave = nombre de una pantalla
// El valor = parametros que recibe

//Aca agregamos el tipo de dato que van a recibir cada pantalla, esto es para que el stack navigator sepa que parametros recibe cada pantalla y nos de autocompletado
export type RootStackParamList = {
    Home: undefined; // no recibe nada
    Detalle: { // recibe nombre y nota
        nombre: string;
        nota: number;
    };
    Crud: undefined;

    Tareas: undefined;

    Ejercicios: undefined;

    Ajustes: undefined;

    TareasLocal: undefined; // <- nueva
};