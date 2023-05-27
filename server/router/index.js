const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const weatherController = require('../controllers/weather-conroller');
const router = new Router();

// пакет express-validator для валидации тела запроса, 
// можно применить пакет class-validator и пакет class-transformer)
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(), // можно передать несколько мидлваре
    body('password').isLength({min: 3, max: 32}),
    // в userController.registration будем получать результаты валидации
    // через validationResult(req)
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// link - динамическая часть пути
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

// функция userController.getUsers будет доступна 
// только авторизованным пользователям 
// authMiddleware - мидлваре запускаем до функции обработчика маршрута
router.get('/service', authMiddleware, weatherController.getWeather);

module.exports = router
