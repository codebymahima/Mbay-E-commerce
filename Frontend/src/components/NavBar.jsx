
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import api from "../api/axios"

const NavBar = () => {

  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  const userId = localStorage.getItem("userId")

  useEffect(() => {

    const loadCart = async () => {

      if (!userId) {
        setCartCount(0)
        return
      }

      try {
        const res = await api.get(`/cart/${userId}`)

        const total = res.data.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        )

        setCartCount(total)

      } catch (error) {
        console.error("Error loading cart:", error)
        setCartCount(0)
      }
    }

    loadCart()

    window.addEventListener("cartUpdated", loadCart)

    return () => {
      window.removeEventListener("cartUpdated", loadCart)
    }

  }, [userId])


  const logout = () => {
    localStorage.clear()
    setCartCount(0)
    navigate("/login")
  }


  return (
    <nav className="flex justify-between items-center p-4 shadow">

      {/* Logo */}
      <Link
        to="/"
        className="font-bold text-xl"
      >
        MBay Ecommerce
      </Link>


      {/* Right Side */}
      <div className="flex gap-4 items-center">

        {/* Cart */}
        <Link
          to="/cart"
          className="relative text-lg font-medium"
        >
          🛒 Cart

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>


        {/* Login / Signup / Logout */}
        {!userId ? (
          <>
            <Link
              to="/login"
              className="text-lg"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-lg"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="text-lg"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  )
}

export default NavBar
