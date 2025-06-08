import { config } from "dotenv";

config()

export default {
    app:{
        PORT: process.env.PORT || process.env.LOCAL_PORT,
    },
    mongo: {
        URL: process.env.MONGO_URL,
    },
}