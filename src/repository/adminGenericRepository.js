import GenericRepository from "./genericRepository";

export default class AdminGenericRepository extends GenericRepository {

    constructor(dao) {
        if(AdminGenericRepository === this.constructor) {
            throw new Error("Cannot instantiate abstract class AdminGenericRepository");
        }
        super(dao);
    }

    create = async (doc) =>{
        return await this.dao.create(doc);
    }

    update = async (id, data) => {
        return await this.dao.update(id, data);
    }
    
    disableProduct = async (id) =>{
        return await this.dao.disableProduct(id);
    }


}