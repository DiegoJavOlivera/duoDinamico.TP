// nameCostumer, products, total 
const createTicket = async (data) => {
    return await apiFetch('ticket/', { method: 'POST', body: data });
};
