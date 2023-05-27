const weatherService = require('../service/weather-service');

class WeatherController{

    // authMiddleware - мидлваре уже был запущен до 
    // этой функции обработчика роута
    async getWeather(req, res, next) {
        try {
            const weather = await weatherService.getWeather();

            console.log('---WeatherController weather ', weather)

            return res.json(weather);
        } catch (e) {
            // если возникла ошибка, то пробрасывем ее, ошибка будет обработана
            // функцией мидлваре для обработки ошибок который прописали в конце
            // в index.js - app.use(errorMiddleware)
            next(e); 
        }
    }

}

module.exports = new WeatherController();