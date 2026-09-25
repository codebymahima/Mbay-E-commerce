import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link} from 'react-router'

const Home = () => {

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  // const loadProducts = async ()=>{
  //   const res = await api.get(`products?search=${search}&category=${category}`)
  //   setProducts(res.data);
  // }
  const loadProducts = async () => {
  const res = await api.get(
    `/products?search=${search}&category=${category}`
  )

  console.log("Category:", category)
  console.log("Products:", res.data)

  setProducts(res.data)
}

  useEffect(()=>{
    loadProducts();
  }, [search, category])

  const addToCart = async (productId)=>{
    const userId = localStorage.getItem("userId")
    if(!userId){
      alert("Please login to add items to your cart")
      return
    }

    const res = await api.post(`/cart/add`, {userId, productId})
    const total = res.data.cart.items.reduce(
      (sum, item)=> sum+ item.productId.price * item.quantity, 0
    )

    localStorage.setItem("cartCount", total)
    window.dispatchEvent(new Event("cartUpdated"))
  }
  return (
    <div className='p-6'>
      <div className='mb-4 flex gap-3'>
        <input 
        placeholder='Search Products'
        value = {search}
        onChange = {(e)=> setSearch(e.target.value)}
        className='border px-3 py-2 rounded w-1/2' />
        <select 
        value = {category}
        onChange={(e)=>setCategory(e.target.value)}
        className='border px-3 py-2 rounded'>
          <option value="">All categories</option>
          <option value="Laptop">Laptop</option>
          <option value="Mobile">Mobile</option>
          <option value="Tablet">Tablet</option>
        </select>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
        {products.map((product)=>(
          <Link
          key={product._id}
          to={`/product/${product._id}`}
          className='border p-3 rounded shadow hover:shadow-lg transition'>
            <img src={product.image} alt={product.title}
            className='w-full h-40 object-contain bg-white rounded' />
            <h2 className='mt-2 font-semibold text-lg'>{product.title}</h2>
            <p className='text-gray-600'>${product.price}</p>
            <button onClick={()=> addToCart(product._id)}
              className='mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded '>Add to Cart</button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home