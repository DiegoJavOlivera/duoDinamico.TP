
export default class LoginRepository {
    constructor(dao) {
        this.dao = dao;
    }

    login = async (email, password) => {
        return await this.dao.login(email, password);
    }

    passwordReset = async (email, newPassword) => {
        return await this.dao.passwordReset(email, newPassword);
    }

    matchPassword = async (password ,hashPassword) => {
        return await this.dao.matchPassword(password, hashPassword);
    }

    hashPassword = async (password) => {
        return await this.dao.hashPassword(password);
    }

}
