
const getConfig = (key) => {
    if(!(key in process.env)) {
        throw new Error(`La variable de entorno ${key} no está definida. Leer el README.md para el .env`);
    }

    return process.env[key];
};

module.exports = {
    getConfig
};