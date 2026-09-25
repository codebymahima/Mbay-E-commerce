import React, { useEffect, useState } from "react"
import api from "../api/axios"

const Cart = () => {

  const userId = localStorage.getItem("userId")

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  const loadCart = async () => {

    // User is not logged in
    if (!userId) {
      setCart({ items: [] })
      setLoading(false)
      return
    }

    try {

      setLoading(true)
      setError("")

      const res = await api.get(`/cart/${userId}`)

      console.log("CART RESPONSE:", res.data)

      setCart(res.data)

    } catch (error) {

      console.error("ERROR LOADING CART:", error)
      console.error("ERROR RESPONSE:", error.response?.data)

      setError(
        error.response?.data?.message ||
        "Failed to load cart"
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadCart()
  }, [])


  const removeItem = async (productId) => {

    try {

      await api.post("/cart/remove", {
        userId,
        productId
      })

      await loadCart()

      window.dispatchEvent(
        new Event("cartUpdated")
      )

    } catch (error) {

      console.error("Error removing item:", error)

    }
  }
// const updateQuantity = async (productId, quantity) => {
//   try {
//     if (quantity <= 0) {
//       await removeItem(productId)
//       return
//     }

//     await api.post("/cart/update", {
//       userId,
//       productId,
//       quantity
//     })

//     await loadCart()

//     window.dispatchEvent(
//       new Event("cartUpdated")
//     )

//   } catch (error) {
//     console.error(
//       "Error updating quantity:",
//       error.response?.data || error
//     )
//   }
// }




const updateQuantity = async (productId, quantity) => {
  console.log("UPDATE CLICKED")
  console.log("productId:", productId)
  console.log("quantity:", quantity)
  console.log("userId:", userId)

  try {
    const res = await api.post("/cart/update", {
      userId,
      productId,
      quantity
    })

    console.log("UPDATE RESPONSE:", res.data)

    await loadCart()

  } catch (error) {
    console.error("UPDATE ERROR:", error)
    console.error("UPDATE ERROR RESPONSE:", error.response?.data)
  }
}


  // const updateQty = async (productId, quantity) => {

  //   if (quantity === 0) {
  //     await removeItem(productId)
  //     return
  //   }

  //   try {

  //     await api.post("/cart/update", {
  //       userId,
  //       productId,
  //       quantity
  //     })

  //     await loadCart()

  //     window.dispatchEvent(
  //       new Event("cartUpdated")
  //     )

  //   } catch (error) {

  //     console.error("Error updating quantity:", error)

  //   }
  // }


  // Loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading cart...
      </div>
    )
  }


  // Error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    )
  }


  const total = cart.items.reduce(
    (sum, item) =>
      sum + item.productId.price * item.quantity,
    0
  )


  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Your Cart
      </h1>


      {cart.items.length === 0 ? (

        <div className="text-gray-600">
          Your cart is empty
        </div>

      ) : (

        <>

          <div className="space-y-4">

            {cart.items.map((item) => (

              <div
                key={item.productId._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >

                {/* Product Information */}

                <div className="flex items-center gap-4">

                  <img
                    src={item.productId.image}
                    alt={item.productId.title}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div>

                    <h2 className="text-lg font-semibold">
                      {item.productId.title}
                    </h2>

                    <p className="text-gray-600">
                      ${item.productId.price.toFixed(2)}
                    </p>

                  </div>

                </div>


                {/* Quantity Controls */}

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId._id,
                        item.quantity - 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>


                  <span className="px-2">
                    {item.quantity}
                  </span>


                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId._id,
                        item.quantity + 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>


                  <button
                    onClick={() =>
                      removeItem(item.productId._id)
                    }
                    className="ml-3 px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* Total */}

          <div className="mt-6 text-right">

            <h2 className="text-xl font-bold">
              Total: ${total.toFixed(2)}
            </h2>

          </div>

        </>

      )}

    </div>
  )
}

export default Cart

