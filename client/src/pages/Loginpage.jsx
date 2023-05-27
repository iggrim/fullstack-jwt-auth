import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hook/useAuth'
import {observer} from "mobx-react-lite";
import { useEffect } from 'react';


const LoginPage = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const {login, errorMessage, setErrorMessage } = useAuth();

    useEffect(() => {
    console.log('----LoginPage useEffect' )
       setErrorMessage('');
      }, [] )

    // забираем pathname из <Navigate to='/login' state={{from: location}} />
    // из location,чтобы вернуться назад
    // const fromPagePath = location.state?.from?.pathname || '/';
    const fromPageMessage = location.state?.message || '';

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.username.value;
        const password = form.password.value;
        // второй параметр для редиректа
        login(email, password, () => navigate('/service', {replace: true}));
    }

  return (
    <div>
      <h1>Login page</h1>
      <label>{fromPageMessage}</label>
      <label>Введите логин и пароль, или <Link to='/registration'>зарегестрируйтесь</Link></label>
      <form onSubmit={handleSubmit}>
        <label>
            Email: <input name="username" />
        </label>
        <label>
            Password: <input name="password" />
        </label>
   
        <button type="submit">Login</button>
      </form>

      <div style={{color:'red'}}>{errorMessage }</div>
    </div>
  )
})

export {LoginPage};