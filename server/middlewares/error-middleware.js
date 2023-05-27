const ApiError = require('../exceptions/api-error');

// особенность - мидлваре для обработки ошибок принимает саму ошибку
module.exports = function (err, req, res, next) {
    console.log('Ошибка: ', err, ' -----error-middlware------');
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Непредвиденная ошибка'})

};
