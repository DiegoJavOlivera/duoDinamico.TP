import AdminGenericRepository from "./adminGenericRepository";

export default class SuperAdminRepository extends AdminGenericRepository {
    
    constructor(dao) {
        super(dao);
    }

    setActiveAdmin = async (adminId, active) => {
        return await this.dao.setActiveAdmin(adminId, active);
    }

    createAdmin = async (adminData) => {
        return await this.dao.createAdmin(adminData);
    }

    getAllAdmins = async () => {
        return await this.dao.getAllAdmins();
    }
    
}