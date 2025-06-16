const isValidId = (id) => {
    return typeof id === 'number' && Number.isInteger(id) && id > 0;
};


module.exports = {
    isValidId
};