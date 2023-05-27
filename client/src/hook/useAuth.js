import { useContext } from 'react';
import { AuthContext123 } from '../hoc/AuthProvider';

export function useAuth() {   
    // useContext принимает в качестве параметра тот контекст 
    // на который мы хотим подписаться
    return useContext(AuthContext123); 
}
