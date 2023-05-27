import  {useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import {observer} from "mobx-react-lite";

const Homepage = observer( () => {
    const {checkAuth, user, isAuth} = useAuth();

    useEffect(() => {
        if (localStorage.getItem('token')) {    
            // console.log('---useEffect ')
            // вызываем экшен из Сторы
            // который сделает запрос на сервер с прикрепленным заголовком 
            // авторизации и если токен не "протухший", то сервер веренет 
            // токены и данные пользователя
            // а рефреш-токен сервер установит в куку, на клиенте (здесь)
            checkAuth();
        }
    },[isAuth, user.isActivated]);

    console.log('---Homepage isAuth ', isAuth)

    return (
        <div>
            
            {!isAuth?`Сервис доступен только для зарегестрированных пользователей`:
            user.isActivated ? `Добро пожаловать на сервис "Прогноз погоды"` :
            `Активируйте аккаунт` }
        </div>
    )
}
)

export {Homepage}
