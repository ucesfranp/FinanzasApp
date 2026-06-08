import axios from 'axios'; 
import { Transaccion } from '../screens/FinanzasTypes'; 

const api = axios.create({ 
    baseURL: 'https://6a25e93f5447714a6f83c529.mockapi.io', 
}); 

export const transaccionesApi = { 
    getAll: () => 
        api.get<Transaccion[]>('/gastos'), 
    
    create: (transaccion: Omit<Transaccion, 'id' | 'api_id'>) => 
        api.post<Transaccion>('/gastos', transaccion), 
    
    update: (id: string, transaccion: Omit<Transaccion, 'id'>) => 
        api.put<Transaccion>(`/gastos/${id}`, transaccion), 
    
    remove: (id: string) => 
        api.delete(`/gastos/${id}`), 
};
