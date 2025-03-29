//imports
require("dotenv").config();
const mongoose = require("mongoose");

//async function
const connectDb = async () => {

    //try..catch
    try {

        //make sure .env variable is set up
        if(!process.env.MONGO_URI_CLOUD) {
            throw new Error("MONGO_URI_CLOUD is not defined in .env file");
        }

        //console the attempt to connect to Atlas
        console.log("Connecting to MongoDD Atlas...");

        //connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI_CLOUD, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        //console successful connection
        console.log("MongoDB Atlas connected successfully..");

    } catch(err) {
        //log unsuccessful connection
        console.log("MongoDb connection error!!!", err);
        
        process.exit(1);//exit if connection fails
    }
};

//exports
module.exports = connectDb;