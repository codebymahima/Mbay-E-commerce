import mongoose from 'mongoose';

const connectDB = async ()=>{
  try{
      await mongoose.connect(process.env.MONGO_URI)
      console.log('Databse connected successfully');
      
  }
  catch(error){
    console.log(`Error: ${error.message}`);
    
  }
}

export default connectDB;