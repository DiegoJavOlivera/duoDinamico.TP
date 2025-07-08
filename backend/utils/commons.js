/**
 * Verifica si un ID es un número entero positivo válido.
 * @param {number} id - El ID a validar.
 * @returns {boolean} True si el ID es un entero positivo.
 */
const isValidId = (id) => {
    return typeof id === 'number' && Number.isInteger(id) && id > 0;
};

/**
 * Verifica si todos los elementos de un array son verdaderos (truthy).
 * @param {Array} arr - Array de valores a validar.
 * @returns {boolean} True si todos los elementos son truthy.
 */
const isAllValid = (arr) => arr.every(Boolean);


module.exports = {
    isValidId,
    isAllValid
};