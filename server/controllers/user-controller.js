const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

// в контроллере обрабатываем http запросы
// то, что относится к http состовляющей
class UserController {
    async registration(req, res, next) {
        try {
            // до этого в роуте для регистрации добавили валидацию
            // логина и пароля, здесь проверяем результаты через validationResult(req)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            
            const userData = await userService.registration(email, password);

            // отправляем данные в браузер
            // httpOnly - Boolean - Flags the cookie to be accessible only by the 
            // web server, можно дополнительно применить флаг ---для HTTPS----
            // secure - Boolean - Marks the cookie to be used with HTTPS only.
            // здесь в res.cookie(...) первый параметр (у нас refreshToken) ключ 
            // под которым кука(второй параметр) сохраняется
            // третий параметр - опции.
            // чтобы эта конструкция работала мы в index.js подключили парсер
            // app.use(cookieParser());
            //console.log('--refreshToken ' , userData.refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            return res.json(userData);
        } catch (e) {
            // если возникла ошибка, то пробрасывем ее, ошибка будет обработана
            // функцией мидлваре для обработки ошибок который прописали в конце
            // в index.js - app.use(errorMiddleware)
            next(e); 
        }
    }

    async login(req, res, next) {
        try {
            // из тела запроса вытаскиваем логин и пароль
            const {email, password} = req.body; 
            const userData = await userService.login(email, password);

            // устанавливаем куки на клиенте, логика такая же как и в registration
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData); // исправил
        } catch (e) {
            // если возникла ошибка, то пробрасывем ее, ошибка будет обработана
            // функцией мидлваре для обработки ошибок который прописали в конце
            // в index.js - app.use(errorMiddleware)
            console.log('-----Ошибка. user-controller, login()------')
            next(e); 
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);          
            //  на клиенте удаляем куку - res.clearCookie
            res.clearCookie('refreshToken'); 
            // вернем сам токен
            return res.json(token); 
        } catch (e) {
            next(e); // если возникла ошибка, то пробрасывем ее
        }
    }

    async activate(req, res, next) {
        try {
            // ранее отослали клиенту такую ссылку: <a href="${link}">${link}</a>
            // клиент отправляет get запрос с параметром link
            const activationLink = req.params.link;
            await userService.activate(activationLink);

            // пернапрвление на фронтенд - localhost:3000через res.redirect
            return res.redirect(`${process.env.CLIENT_URL}`);
        } catch (e) {
            // если возникла ошибка, то пробрасывем ее, ошибка будет обработана
            // функцией мидлваре для обработки ошибок который прописали в конце
            // в index.js - app.use(errorMiddleware)
            next(e); 
        }
    }

    // на сервере обработка маршрута по маршруту "/refresh", 
    // вызывается из роутера index.js
    // router.get('/refresh', userController.refresh);
    async refresh(req, res, next) { 
        try {
            // клиент в Bearer отправил в Bearer refreshToken, получаем его из req.cookies
            // благодаря ранее установленному пакету cookie-parser
            // ПОКА ничего не отправил
            const {refreshToken} = req.cookies; 
            console.log('----refresh refreshToken - ', refreshToken) // получили

            // аналогично login, только refresh
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            // зачем возвращать два токена, когда refresh token сервер
            // итак записывает клиенту в куки. 
            return res.json(userData);
        } catch (e) {
            next(e); // если возникла ошибка, то пробрасывем ее
        }
    }
}


module.exports = new UserController();
