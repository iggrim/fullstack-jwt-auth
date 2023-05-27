//import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
//import {IAuthResponse} from "../models/response/IAuthResponse";
import {API_URL} from "../http";

export default class Store {
    _user = {};
    _isAuth = false;
    _isLoading = false;
    _errorMessage = '';
    
    

    constructor() {
        //this.isAuth = false;
        //this.isLoading = false;
        // this._user = {};  
        // this._isAuth = false;
        // this._user = {};
        // this._isLoading = false;
        
        makeAutoObservable(this);
    }

    setErrorMessage = (err) => {
        this._errorMessage = err;
    }

    
    // =====мутации изменяющие поля Стора
    // все что мы делаем, это изменяем текущее значение, на значение
    // которое получаем в параметрах
    setAuth = (bool) => {
        // это состояние будем проверять при показе элементов формы в зависимости
        // если пользователь авторизован или нет - store.isAuth?
        // `Пользователь авторизован или 'АВТОРИЗУЙТЕСЬ' 
        // показ кнопки "Получить пользователей"
        
        this._isAuth = bool; 
        console.log('--store this._isAuth ', this._isAuth)
    }

    setUser = (user) => {
        // использование в дальнейшем - store.user.isActivated?
        // 'Аккаунт подтвержден по почте' 'ПОДТВЕРДИТЕ АККАУНТ!!!!'
        this._user = user;
    }

    setLoading = (bool) => {
        this._isLoading = bool;
    }

    get errorMessage () {
        return this._errorMessage;
    }
 

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get isLoading(){
        return this._isLoading;
    }

    // ==================================

    // экшены login, registration, logout, checkAuth
    login = async (email, password, cb) =>{
        try {
            const response = await AuthService.login(email, password)          
            
            // если запрос прошел успешно, то в ответе от сервера получаем токены
            localStorage.setItem('token', response.data.accessToken);
            
            // вызываем ранее созданную здесь в Сторе мутацию 
            this.setAuth(true);
            
            // также в ответе мы получили данные о пользователе
            // сохраняем их в Стору вызывая ранее созданную здесь в Сторе мутацию
            this.setUser(response.data.user);
            
            cb();

        } catch (e) {
            //console.log(e.response?.data?.message);
            console.log('--login error ', e.response.statusText);

            if(e.response.status == 500){
                this.setErrorMessage(e.response.statusText + `. Сервер не отвечает...`); 
            } else {
                this.setErrorMessage(e.response.data.message);
            }
            
        }
    }

   
    // registration аналогична login, только метод AuthService.registration
    registration = async (email, password, cb) => {
        try {
            const response = await AuthService.registration(email, password);
            console.log('---registration response: ', response);

            localStorage.setItem('token', response.data.accessToken);
            
            // изменяем стору
            // вызываем ранее созданные здесь в Сторе мутации
            this.setAuth(true);
            
            this.setUser(response.data.user);
            cb();

        } catch (e) {
            //console.log(e.response?.data?.message);
            console.log('--login error ', e.response);

            this.setErrorMessage(e.response.data.message);
        }
    }

     logout = async () => {
        try {
            const response = await AuthService.logout();
            // удаляем токен из хранилиша
            localStorage.removeItem('token');

            // изменяем стору
            this.setAuth(false);
            this.setUser({});
            console.log('---store isAuth ', this.isAuth)
            this.setErrorMessage('');

        } catch (e) {
            //console.log(e.response?.data?.message);
            console.log(e);
        }
    }

    // каждый раз когда открываем приложение нам надо получать информацию о пользователе
    // убедится в том, что пользователь авторизован  
    // checkAuth() вызываем в useEffect() в App
    checkAuth = async() => { 
        
        this.setLoading(true); // запрос пошел
        try {

            // API_URL = `http://localhost:5000/api`
            // запрос на сервер с помощью дефолтного axios с
            // заголовком авторизации с рефреш токеном (из куки-оунли который ранее
            // установил сервер) будет отправлен автоматом
            // т.к. указали здесь withCredentials: true 
            // от сервреа получаем return {...tokens, user: userEntity}
            // (запрос на сервер на login возвращает то же самое - {...tokens, user: userEntity})  
            // если запрос не прошел проверку на сервере, то на стороне сервера
            // возбуждается исключение throw ApiError.UnauthorizedError()
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            console.log('---checkAuth response: ', response);

            // accessToken записываем в локальное хранилище
            localStorage.setItem('token', response.data.accessToken);
            //this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            //console.log(e.response?.data?.message);
            console.log('--checkAuth error ', e);
        } finally {
            this.setLoading(false); // запрос завершился
        }
    }
}
