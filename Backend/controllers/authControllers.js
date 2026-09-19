import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


//signup user
export const signupUser = async (req, res)=>{
  try{
    const {name, email, password} = req.body

    //Checking if user already exists
    const userExists = await User.findOne({email})
    if(userExists){
      return res.status(400).json({message: "User already exists"})
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 10)

    //create user
    await User.create({
      name,
      email,
      password: hashPassword
    });

    res.json({message: "User registered successfully"})

  } 
  catch(error){
    res.status(500).json({message: "Server error", error})
  }
}

// Login User
export const loginUser = async(req, res)=>{
  try{
    const {email, password} = req.body;

    //check if user already exists
    const userFound = await User.findOne({email});
    if(!userFound){
      return res.status(400).json({message: "User not found "})
    }

    //compare password
    const matchPassword = await bcrypt.compare(password, userFound.password)
    if(!matchPassword){
      return res.status(400).json({message: "Invalid credentials"})
    }

    //generate JWT token
    const token = jwt.sign(
      {id: userFound.id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    )
    res.json({
      message: "Login successful",
      token,
      user:{
        id: userFound._id,
        name: userFound.name,
        email: userFound.email
      }
    })
  }
  catch(error){
  res.status(500).json({message: "Server error", error})
}}