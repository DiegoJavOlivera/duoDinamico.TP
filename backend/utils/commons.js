const isValidId = (id) => {
    return typeof id === 'number' && Number.isInteger(id) && id > 0;
};



const isAllValid = (arr) => arr.every(Boolean);


module.exports = {
    isValidId,

    isAllValid
};