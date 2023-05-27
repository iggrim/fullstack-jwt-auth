const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserEntity = require('../entity/user-entity');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с именем ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        // здесь надо послать уведомлению пользователю о письме на почту
        // email - кому, напр. mig-syst@mail.ru

        // создаем объект UserEntity без пароля (там нет поля password)
        const userEntity = new UserEntity(user); // id, email, isActivated
        
        // зачем {...userEntity} ведь userEntity это и так объект
        // можно передать просто userEntity // Проверить
        const tokens = tokenService.generateTokens({...userEntity}); 
        

        // в БД сохраняем рефреш-токен
        await tokenService.saveToken(userEntity.id, tokens.refreshToken);

        // возвращаем токены и информацию о пользователе - 
        // userEntity(только без пароля)в наш контроллер 
        return {...tokens, user: userEntity}

    }

    async activate(activationLink) {
        // до этого поиска, в функции registration, уже создали пользователя
        // и в БД у него есть поле с activationLink
        // const user = await UserModel.create({email, password: hashPassword, activationLink})
        // ищем пользователя
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        // в БД присваиваем в таблице user полю isActivated значение тру
        user.isActivated = true;
        await user.save(); // сохраняем пользователя
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            // неверный логин
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        // сравниваем пароль отправленный пароль пользователя
        // с захешированым паролем в БД - user.password
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            // неверный пароль
            throw ApiError.BadRequest('Неверный логин или пароль');
        }

        // логика такая-же как и в registrationв в этом же классе
        const userEntity = new UserEntity(user);

        // при логине каждый раз генерируем новые токены
        // как и при регистрации
        const tokens = tokenService.generateTokens({...userEntity});

        // сохраняем refreshToken в БД
        await tokenService.saveToken(userEntity.id, tokens.refreshToken);

        //return {...tokens, user: userEntity} 
        return {...tokens, user: userEntity}
    }

    async logout(refreshToken) {
        // удаляем токен из документа с токенами в БД, через tokenService
        // логика по удалнию токена находится на уровне сервиса
        const token = await tokenService.removeToken(refreshToken);
        return token; // зачем возвращаем??? // для наглядности говорит
    }

    async refresh(refreshToken) {
        if (!refreshToken) { // если у пользователя нет токена, то он не авторизован
            throw ApiError.UnauthorizedError();
        }

        // проверяем переданный токен из запроса 
        // в tokenService в validateRefreshToken 
        // на достоверность и на то что срок годности его не иссяк
        // уровень токен-сервиса   <<2>>
        const userData = tokenService.validateRefreshToken(refreshToken);
        console.log('---user-service userData ', userData)
        // <<я бы сначала искал <1> токен, а затем его <2>валидировал>>

        // ищем переданный от клиента токен в БД, через tokenService 
        // уровень токен-сервиса <<1>>
        const tokenFromDb = await tokenService.findToken(refreshToken);
        console.log('---user-service tokenFromDb ', tokenFromDb)
        
        if (!userData || !tokenFromDb) {
            // если токена у пользователя нет, то значит он и не авторизован
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        console.log('---user-service user ', user)

        const userEntity = new UserEntity(user);

        // уровень токен-сервиса
        const tokens = tokenService.generateTokens({...userEntity});
        // console.log('---user-service tokens ', tokens);

        await tokenService.saveToken(userEntity.id, tokens.refreshToken);

        return {...tokens , user: userEntity};       
    }   
}

module.exports = new UserService();
