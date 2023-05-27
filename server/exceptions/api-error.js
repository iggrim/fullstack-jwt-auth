module.exports = class ApiError extends Error {
    status; // избыточные объявления
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(message) {
        return new ApiError(401, `${message} "Пользователь не авторизован"`)
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}
