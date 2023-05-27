module.exports = class UserEntity {
    email; // избыточные объявления
    id;
    isActivated;

    /*здесь model - это просто объект user созданный, например, через
    модель пользователя user-model
    const user = 
    await UserModel.create({email, password: hashPassword, activationLink})*/
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
