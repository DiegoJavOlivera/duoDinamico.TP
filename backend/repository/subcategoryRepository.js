
const { Subcategory } = require("../models/index");

const getSubcategory = (category_id = '') => {
    if(!category_id){
        return Subcategory.findAll({
            include: [
                {
                    association: "Category",
                    attributes: ['id', 'name']
                }
            ]
        });
    }
    return Subcategory.findAll({ where: { category_id } });
};

module.exports = getSubcategory;
