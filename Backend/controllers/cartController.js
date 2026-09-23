import Cart from "../models/Cart.js";

export const addToCart = async(req,res)=>{
  try{
    const {userId, productId} = req.body
    let cart = await Cart.findOne({userId})

    if(!cart){
      cart = new Cart({userId, items: [{productId, quantity: 1}]})
    }else{
      const item = cart.items.find(i=>i.productId.toString()===productId)
    }

    if(item){
      item.quantity +=1
    } else{
      cart.items.push({productId, quantity: 1})
    }
    await cart.save()
    res.json({
      message: 'Item added to cart',
      cart
    })

  }
   catch(error){
    res.status(500).json({message: 'Server Error', error})
  }
}

export const removeItem = async (req, res)=>{
  try{
    const {userId, productId} = req.body
    let cart = await Cart.findOne({userId})

    if(!cart){
      res.status(404).json({message: 'cart not found'})
    }

    cart.items = cart.items.filter(i=i.productId.toString() !== productId)

    await cart.save()
    res.json({ message: 'Item removed from cart', cart})
  } 
  catch(error){
    res.status(500).json({message: 'Server error', error})
  }
}


export const updateQuantity = async (req, res)=>{
  try{
    const {userId, productId, quantity} = req.body
    let cart = await Cart.findOne({userId})

    if(!cart){
      res.status(404).json({message: 'cart not found'})
    }

    cart.items = cart.items.filter(i=i.productId.toString() === productId)
    if(!item){
      return res.status(404).json({message: 'Item not found in cart'})
    }

    item.quantity = quantity
    await cart.save()
    res.json({message: 'Irem quantity updated'})
    
  } 
  catch(error){
    res.status(500).json({message: 'Server error', error})
  }
}

export const getCart = async (req, res)=>{
  try{
    const {userId} = req.params
    let cart = await Cart.findOne({userId}).populate('items.productId')

    
    res.json(cart)
  } 
  catch(error){
    res.status(500).json({message: 'Server error', error})
  }
}