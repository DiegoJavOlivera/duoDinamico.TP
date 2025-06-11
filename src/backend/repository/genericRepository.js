


export default class GenericRepository {
    
    constructor(dao){
        this.dao = dao;        
    }
    
    getBy = async (params) => {
        return await this.dao.getBy(params);
    }

}   