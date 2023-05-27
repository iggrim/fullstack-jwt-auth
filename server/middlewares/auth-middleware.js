const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        // проверяем есть ли заголовок authorization
        const authorizationHeader = req.headers.authorization;      
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError(authorizationHeader));
        }

        // вытаскиваем из заголовка токен
        // Bearer - первый элемент, токен - второй
        const accessToken = authorizationHeader.split(' ')[1];      
        if (!accessToken) {    
            return next(ApiError.UnauthorizedError("Not Bearer"));
        }

        // валидируем токен, получаем payload который мы "вшивали" в токен
        const userData = tokenService.validateAccessToken(accessToken);
        console.log('---userData', userData)
        if (!userData) {    
            return next(ApiError.UnauthorizedError("Not accessToken"));
        }

        req.user = userData; // создаем в req поле user  и присваиваем ему userData
        next(); // здесь для мидлваре обязательный вызов next()
    } catch (e) {

        console.log('---Непредвиденная ошибка')
        return next(ApiError.UnauthorizedError());
    }
};
