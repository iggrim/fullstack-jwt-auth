import axios from 'axios';

// export const API_URL = `http://localhost:5000/api`
// в package.json указал "proxy": "http://localhost:5000",
export const API_URL = `/api`

const $api = axios.create({
    // withCredentials: true    
    baseURL: API_URL
})

// Добавляем перехват запросов (---от нас---)
// ------На каждый запрос будет цепляться аксес-токен-------
$api.interceptors.request.use((config) => {
    // из локального хранилища достаем аксес-токен
    // ---а рефреш-токен сервер запишет клиенту в куки при регистрации или логине---
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

// Добавляем перехват ответов(от сервера)
$api.interceptors.response.use((config) => {
    // Обработчик для успешного случая; просто пропускаем ответ дальше
    return config; 
},async (error) => {

    // -----данные для повторного запроса------
    const originalRequest = error.config; 

    // чтобы не зациклить запросы поле error.config._isRetry не равно true
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        // чтобы не зациклиться отмечаем, что сделали один запрос
        originalRequest._isRetry = true; // 
        
        try {
            // параметр {withCredentials: true} цепляет куку
            // описание withCredentials в самом низу
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            
            // из ответа вытаскиваем аксес-токен и пишем его в localStorage
            localStorage.setItem('token', response.data.accessToken);
            
            // --------повторный запрос--------
            return $api.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error; // если ошибка не 401 статусом
})

export default $api;

/*
Свойство XMLHttpRequest.withCredentials это Boolean который определяет, 
должны ли создаваться кросс-доменные Access-Control запросы с использованием 
таких идентификационных данных как cookie, авторизационные заголовки или TLS 
сертификаты. Настройка withCredentials бесполезна при запросах на тот же домен.

Вдобавок, этот флаг также используется для определения, будут ли 
проигнорированы куки переданные в ответе. Значение по умолчанию - false. 
XMLHttpRequest с другого домена не может установить cookie на свой собственный 
домен в случае, если перед созданием этого запроса флаг withCredentials не 
установлен в true. Сторонние cookies, полученные с помощью установки 
withCredentials в true, всё равно будут соблюдать политику одинакового 
домена и, следовательно, не могут быть получены запрашивающим скриптом 
через document.cookie или из заголовков ответа.
*/

