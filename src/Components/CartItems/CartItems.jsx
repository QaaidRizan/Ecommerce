import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartItems.css';
import { ShopContext } from './../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, updateToCart, currentCategory } = useContext(ShopContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const filteredItemsInCart = Object.keys(cartItems)
    .filter(itemId => cartItems[itemId].quantity > 0)
    .map(itemId => {
      const product = all_product.find(product => product.id === Number(itemId));
      if (!product) {
        console.warn(`Product not found for id: ${itemId}`);
        return null;
      }
      return {
        ...product,
        ...cartItems[Number(itemId)]
      };
    })
    .filter(item => item !== null)
    .filter(item => currentCategory === '' || item.category === currentCategory);


  // Validation function to check for valid quantities
  const validateCart = () => {
    for (let item of filteredItemsInCart) {
      if (item.quantity <= 0) {
        return `The quantity for ${item.title} must be at least 1.`;
      }
    }
    return null;
  };

  const handleProceedToCheckout = async () => {
    const validationError = validateCart();

    // If validation fails, set error and prevent checkout
    if (validationError) {
      setError(validationError);
      return;
    }

    // If no items in cart, show error
    if (filteredItemsInCart.length === 0) {
      setError('Your cart is empty. Please add items to proceed.');
      return;
    }

    const formattedCartItems = filteredItemsInCart.map(item => ({
      product_id: item.id,  // Use the actual ID
      title: item.name,
      price: item.new_price,
      category: item.category,
      size: item.size,
      quantity: item.quantity,
      total: item.new_price * item.quantity
    }));
    

    try {
      const response = await Promise.all(
        formattedCartItems.map(async (cartItem) => {
          return await axios.post('http://localhost:8082/db-api/cart/products', cartItem);
        })
      );

      if (response.every(res => res.status === 200)) {
        navigate('/orders');
      } else {
        alert('Error proceeding to checkout');
      }
    } catch (error) {
      console.error('Error during checkout:', error.response || error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-header">
        <h2>Cart Items</h2>
      </div>

      {error && <p className="error">{error}</p>} {/* Display validation error if exists */}

      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Product ID</p>
        <p>Title</p>
        <p>Price</p>
        <p>Category</p>
        <p>Size</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {filteredItemsInCart.length > 0 ? (
  filteredItemsInCart.map((item, index) => (
    <div key={item.id}>
      <div className="cartitems-format cartitems-format-main">
        <img src={item.image} alt="" className='carticon-product-icon' />
        <p>{item.id}</p> {/* Display actual Product ID */}
        <p>{item.name}</p>
        <p>Rs.{item.new_price}</p>
        <p>{item.category}</p>
        <p>{item.size}</p>
        <input
          type="number"
          value={item.quantity}
          min="1"
          className='cartitems-quantity-input'
          onChange={(event) => updateToCart(item.id, parseInt(event.target.value))}
        />
        <p>Rs. {item.new_price * item.quantity}</p>
        <img
          src={remove_icon}
          onClick={() => removeFromCart(item.id)}
          alt="remove"
        />
      </div>
      <hr />
    </div>
  ))
) : (
  <p>No items in the cart for the selected category.</p>
)}


      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount() - 200}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Rs.200</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rs.{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
