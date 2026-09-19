import {React, useState} from 'react'
import {useNavigate} from "react-router";
import api from "../api/axios"

const Login = () => {

  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
      const res = await api.post("/auth/login", form)
      console.log(res, "data")
      //save token to localstorage
      localStorage.setItem("token", res.data.token)

      setMsg("Login Successful")
      // Redirect to Home page after 1 second
      setTimeout(()=>{
        navigate("/")
      }, 1000)
    }
    catch(error){
      setMsg(error.response?.data?.message || "An error occurred")
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
        <h2 className="text-2xl fond-bold mb-6 text-center">Login to your Account</h2>
        {msg && (
          <div className="mb-4 text-center text-sm text-red-600 font-medium">
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input name='email' type='email' placeholder='Enter email' value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required/>
          <input name='password' type='password' placeholder='Enter password' value={form.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required/>
          <button type='submit' className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'>Login</button>
          
        </form>
      </div>
    </div>
  )
}

export default Login