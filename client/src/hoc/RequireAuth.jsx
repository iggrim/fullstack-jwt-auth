import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth'

//  в роли чилдрен выступает любая страница, у нас <Createpost />
const RequireAuth = ({children}) => { 
    const location = useLocation();
    const {isAuth } = useAuth();

    
    if (!isAuth ) {
        const message = '';
        return <Navigate to='/login' state={{from: location, message}} />
    }

  return children; 
}

export {RequireAuth};
