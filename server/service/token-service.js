const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '600s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '60000s'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        
        try {
            const sec = process.env.JWT_ACCESS_SECRET;
            
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            // если токен "расшифровали" то все окей
            // возвращаем payload который мы "вшивали" в токен
            return userData; 
        } catch (e) {
            return null; // если ошибка, то null, ошибку не пробрасываем
        }
    }

    validateRefreshToken(token) {
        console.log('--validateRefreshToken WT_REFRESH_SECRET: ', process.env.JWT_REFRESH_SECRET)
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            
            // возвращаем payload который мы "вшивали" в токен
            console.log('--validateRefreshToken userData: ', userData)
            return userData;
        } catch (e) {
            console.log('---error на validateRefreshToken', e)
            return null; // если ошибка, то null, ошибку не пробрасываем
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            // перезаписываем старый токен новым
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        // ---если токена нет в БД---, то создаем его в БД
        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData; 
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();
