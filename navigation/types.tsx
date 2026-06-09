// Cada clave = nombre de una pantalla
// El valor = parámetros que recibe

export type RootStackParamList = {
  Home: undefined;
  Movimientos: undefined;
  Categorias: undefined;
  Ajustes: undefined;
  AgregarTransaccion: undefined;
  DetalleTransaccion: {
    id: number;
  };
  AgregarCategoria: undefined;
  EditarCategoria: {
    id: number;
  };
};
