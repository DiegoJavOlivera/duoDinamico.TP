function getEnv(key, defaultValue){
    if(key in process.env){
        return process.env[key];
    }

    return defaultValue;
};

function createConfig(){
    return {
        env: {
            port: getEnv('PORT', 3000) 
        }
    }
}

module.exports = createConfig();