import $api from "../http";
import { useAuth } from '../hook/useAuth'

// axios всегда возвращает объект типа AxiosResponse

export default class AuthService { // тип возвращаемых данных: <AxiosResponse<IAuthResponse>>
    static async login(email, password) {      
        // ------запрос на серврер-------
        // сервер на этот запрос отвечает ---токенами и информацией о пользователе
        // - return {...tokens, user: userEntity}
        // второй параметр - тело запроса
        const response = await $api.post('/login', {email, password})
                
        return response;          
    }

    static async registration(email, password) {
        return $api.post('/registration', {email, password});
    }

    static async logout() {
        return $api.post('/logout');
    }

    static async activate() {
        return $api.get('/activate');
    }
}

