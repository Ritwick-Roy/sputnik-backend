const mongoose=require('mongoose');
require('dotenv').config();
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log('connected to database');
    } catch(err) {
        console.log('connection failed');
        console.log(err);
        process.exit(1);
    }
}

module.exports=connectDB;