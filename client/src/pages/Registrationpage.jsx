import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth'
import {observer} from "mobx-react-lite";
import { useEffect } from 'react';


const RegistrationPage = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    //const {registration, errorMessage } = useAuth();
    const {registration, errorMessage, setErrorMessage } = useAuth();
    useEffect(() => {
    console.log('----RegistrationPage useEffect' )
       setErrorMessage('');
      }, [] )

    // забираем pathname из <Navigate to='/login' state={{from: location}} />
    // из location,чтобы вернуться назад
    const fromPagePath = location.state?.from?.pathname || '/';
    const fromPageMessage = location.state?.message || '';

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.username.value;
        const password = form.password.value;
        // вызываем signin(...)  третий параметр navigate для редиректа
        console.log('--navigate fromPagePath ', fromPagePath);
        registration(email, password, () => navigate(fromPagePath, {replace: true}));
    }

  return (
    <div>
      <h1>Регистрация</h1>
      <label>{fromPageMessage}</label>
      <label>Введите в качестве логина ваш email и придумайте пароль</label>
      <form onSubmit={handleSubmit}>
        <label>
            Email: <input name="username" />
        </label>
        <label>
            Password: <input name="password" />
        </label>
        
        <button type="submit">Регистрация</button>

      </form>
      
      <div style={{color:'red'}}>{errorMessage }</div>

    </div>
  )
})

export {RegistrationPage};


    

  
    <div>
      Регистрация
    </div>
 
