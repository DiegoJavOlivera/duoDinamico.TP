import GenericRepository from './genericRepository.js';


export default class TicketRepository extends GenericRepository {

    constructor(dao) {
        super(dao);
    }

    createTicket = async (docs) => {
        return await this.dao.insert(docs);
    }

    createPdfTicket = async (ticketId) => {
        return await this.dao.createPdfTicket(ticketId)
    }

}