import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

const connectdb= async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected \n ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("Error connecting Data Base",error);
        process.exit(1)
    }
}

export default connectdb