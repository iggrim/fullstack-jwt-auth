import { createContext, useState } from 'react';
import Store from '../store/store'

export const AuthContext123 = createContext(null);
//console.log('--AuthContext ', AuthContext123);

// создаем компонент AuthProvider который сконфигурирует AuthContext
export const AuthProvider = ({children}) => {
    const store = new Store();
    
    return <AuthContext123.Provider value={store}>
        {children}
    </AuthContext123.Provider>
    // компоненты children будут получать данные от провайдера через контекст
}