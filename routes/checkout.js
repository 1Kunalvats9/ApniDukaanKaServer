import express from 'express';
import User from '../models/userModel.js';
import Inventory from '../models/inventoryModel.js';

const router = express.Router();

router.post('/checkout-product', async (req, res) => {
  try {
    const { cart, email } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0 || !email) {
      return res.status(400).json({ message: 'Invalid request data.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let totalPrice = 0;
    let totalProfit = 0;
    const orderedProducts = [];

    for (const cartItem of cart) {
      const { name, price, wholesalePrice, quantity: qty, id } = cartItem;

      const itemTotalPrice = price * qty;
      totalPrice += itemTotalPrice;
      totalProfit += (price - wholesalePrice) * qty;

      console.log(`Product: ${name}, Quantity: ${qty}, Unit Price: ${price}, Subtotal: ${itemTotalPrice}`);
      console.log(`Current Total Price: ${totalPrice}`);

      
      const inventory = await Inventory.findOne({ email });
      if (!inventory) {
        return res.status(404).json({ message: `Inventory not found for email: ${email}` });
      }

      const productInInventory = inventory.products.find(p => p.id === id);

      if (!productInInventory) {
        return res.status(404).json({ message: `Product with ID ${id} not found in inventory.` });
      }

      if (productInInventory.quantity < qty) {
        return res.status(400).json({ message: `Insufficient quantity for product: ${name}` });
      }

      productInInventory.quantity -= qty;
      await inventory.save();

      orderedProducts.push({
        productId: id, // Assuming 'id' in cart item corresponds to product ID in Inventory
        name,
        quantity: qty,
        price,
      });
    }

    const newCheckout = {
      orderedProducts,
      totalPrice,
    };

    user.totalIncome += totalPrice;
    user.profit += totalProfit;
    user.checkoutHistory.push(newCheckout);
    await user.save();

    res.status(200).json({ message: 'Checkout successful. Inventory updated, user income and profit updated.' });

  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'An error occurred during checkout.' });
  }
});

export default router;