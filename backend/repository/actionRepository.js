const {Action} = require('../models/index');

const getAllActions = () => Action.findAll();


module.exports = {
    getAllActions,
};