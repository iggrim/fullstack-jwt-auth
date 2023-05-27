import $api from "../http";


// для получения списка пользователей
export default class WeatherService {
    
    static fetchWeather() {
        // запрос на серврер, на серврер в контроллере по маршруту 
        // "/service" встроен мидлваре authMiddleware
        // для проверки авторизации
        //  к запросу будет добавлен Authorization = `Bearer Токен`
        
        return $api.get('/service')
    }
}
