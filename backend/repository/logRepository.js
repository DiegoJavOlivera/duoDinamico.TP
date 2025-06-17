const {UserActionLog} = require('../models/index');

const addLog = (data) => UserActionLog.create(data);



module.exports = {
    addLog,
};