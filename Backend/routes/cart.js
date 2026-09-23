import express from 'express'

import { addToCart, removeItem, updateQuantity, getCart } from '../controllers/cartController.js'


const router = express.Router()

router.post('/add', addToCart)
router.post('/remove', removeItem)
router.post('/update', updateQuantity)
router.post('/:userId', getCart)

export default router