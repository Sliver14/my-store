import mongoose from "mongoose";

const connectDB = async() => {

    const DB_NAME = "ecommerce";
    mongoose.connection.on('connected', ()=>{
        console.log("DATABASE CONNECTED");
    })

    await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
    
}

export default connectDB;