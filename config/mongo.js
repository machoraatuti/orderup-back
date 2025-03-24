//imports
require("dotenv").config();
const mongoose = require("mongoose");

//async function
const connectDb = async () => {

    //try..catch
    try {

        //console process environment variable
        console.log("MONGO_URI:", process.env.MONGO_URI);

        //connect to mongoDb locally
        await mongoose.connect(process.env.MONGO_URI);

        //log successful connection
        console.log("MongoDb connected successfully...");

    } catch(err) {
        //log unsuccessful connection
        console.log("MongoDb connection error!!!", err);
        
        process.exit(1);//exit if connection fails
    }
};

//exports
module.exports = connectDb;