import  {useEffect, useState } from 'react';
import { useAuth } from '../hook/useAuth';
import WeatherService from '../services/WeatherService'
import {observer} from "mobx-react-lite";

const Service = observer( () => {
    const { user } = useAuth();
    const [weather, setWeather] = useState('');

    useEffect(() => {

        if(user.isActivated){
            
            const fetchData = async () => {
                const w = await WeatherService.fetchWeather();
                setWeather(w.data);
            }
            
            fetchData();
            
        }
       
    },[])  


    return (
        <div>
            <h1>Сервис "Погода"</h1>

            {user.isActivated ? `${weather}`: `Необходимо активировать аккаунт`}
           
        </div>
    )
}
)

export {Service}
