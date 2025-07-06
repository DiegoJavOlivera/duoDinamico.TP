const {UserActionLog} = require('../models/index');

const addLog = (data) => UserActionLog.create(data);

const getPaginatedActions = ({ page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  return UserActionLog.findAndCountAll({
    attributes: ['id', 'created_at'],
    include: [
      {
        association: 'User',
        attributes: ['name']
      },
      {
        association: 'Product',
        attributes: ['id', 'name']
      },
      {
        association: 'Action',
        attributes: ['name']
      }
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });
};


module.exports = {
    addLog,
    getPaginatedActions
};