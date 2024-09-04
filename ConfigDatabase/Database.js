const mongoose = require("mongoose");
const dotenv = require('dotenv').config()


const ConnectDataBase = () => {

    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGODB_URI);

    const db = mongoose.connection;
    db.on("error", (error) => console.log(error));
    db.once("open", () => console.log("DB Connected"));

}
{ }
module.exports = ConnectDataBase