import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import './PlaceOrder.css';

const PlaceOrder = () => {
    const { cartItems, all_product, getTotalCartAmount, updateToCart, removeFromCart } = useContext(ShopContext);
    const [itemsInCart, setItemsInCart] = useState([]);

    // Fetch payment details (if needed)
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8083/db-api/pay/payments');
                console.log('Payment details:', response.data);
            } catch (error) {
                console.error('Error fetching payment details:', error.response || error.message);
            }
        };
        fetchPaymentDetails();
    }, []);

    // Get cart items from context and map to itemsInCart state
    useEffect(() => {
        const newItemsInCart = Object.keys(cartItems)
            .filter(itemId => cartItems[itemId].quantity > 0)
            .map((itemId) => {
                const product = all_product.find(product => product.id === Number(itemId));
                return {
                    product_id: Number(itemId),
                    ...product,
                    ...cartItems[Number(itemId)]
                };
            })
            .filter(item => item.product_id !== null);

        console.log('Items in cart:', newItemsInCart);
        setItemsInCart(newItemsInCart);
    }, [cartItems, all_product]);

    const handleProceedToPayment = async () => {
        const formattedCartItems = itemsInCart.map(item => ({
            product_id: item.product_id,
            title: item.name || item.title,
            price: item.new_price,
            category: item.category,
            size: item.size,
            quantity: item.quantity,
            total: item.new_price * item.quantity
        }));

        try {
            // Delete items from cart in the database
            await Promise.all(
                itemsInCart.map(item => 
                    item.product_id
                        ? axios.delete(`http://localhost:8082/db-api/cart/products/${item.product_id}`)
                        : Promise.resolve()
                )
            );

            // Send POST request to payment endpoint
            const response = await axios.post('http://localhost:8083/db-api/pay/payments', {
                cartItems: formattedCartItems,
                totalAmount: getTotalCartAmount() + 200, // Add delivery fee
            });

            if (response.status === 200) {
                alert('Order placed and payment successful!');
            } else {
                alert('Error placing order or processing payment');
            }
        } catch (error) {
            console.error('Error:', error.response || error.message);
            alert('An error occurred during payment. Please try again.');
        }
    };

    const handleDelete = async (product_id) => {
        console.log('Deleting product with ID:', product_id); // Debugging step
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                if (product_id) {
                    await axios.delete(`http://localhost:8082/db-api/cart/products/${product_id}`);
                    removeFromCart(product_id); // Update the context state
                    alert('Item deleted successfully');
                } else {
                    alert('Item could not be deleted because product_id is missing.');
                }
            } catch (error) {
                console.error('Error:', error.response || error.message);
                alert('An error occurred while deleting the item. Please try again.');
            }
        }
    };

    const handleUpdate = (product_id, quantity) => {
        // Call the update function from context
        updateToCart(product_id, quantity);
        // Show success message
        alert('Update successful');
    };

    return (
        <div className="place-order-container">
            <form className="place-order">
                <div className="place-order-left">
                    <p className="name">Order Information</p>
                    {itemsInCart.length > 0 ? (
                        itemsInCart.map(item => (
                            <div key={item.product_id} className="order-item-details">
                                <div className="order-item-row">
                                    <label htmlFor={`product-id-${item.product_id}`}><b>Product ID:</b></label>
                                    <input
                                        id={`product-id-${item.product_id}`}
                                        type="text"
                                        value={item.product_id}
                                        readOnly
                                    />
                                </div>
                                <div className="order-item-row">
                                    <label htmlFor={`title-${item.product_id}`}><b>Title:</b></label>
                                    <input
                                        id={`title-${item.product_id}`}
                                        type="text"
                                        value={item.name || 'N/A'}
                                        readOnly
                                    />
                                </div>
                                <div className="order-item-row">
                                    <label htmlFor={`price-${item.product_id}`}><b>Price:</b></label>
                                    <input
                                        id={`price-${item.product_id}`}
                                        type="number"
                                        value={item.new_price || 0}
                                        readOnly
                                    />
                                </div>
                                <div className="order-item-row">
                                    <label htmlFor={`category-${item.product_id}`}><b>Category:</b></label>
                                    <input
                                        id={`category-${item.product_id}`}
                                        type="text"
                                        value={item.category || 'N/A'}
                                        readOnly
                                    />
                                </div>
                                <div className="order-item-row">
                                    <label htmlFor={`size-${item.product_id}`}><b>Size:</b></label>
                                    <input
                                        id={`size-${item.product_id}`}
                                        type="text"
                                        value={item.size || 'N/A'}
                                        readOnly
                                    />
                                </div>
                                <div className="order-item-row">
                                    <label htmlFor={`quantity-${item.product_id}`}><b>Quantity:</b></label>
                                    <input
                                        id={`quantity-${item.product_id}`}
                                        type="number"
                                        value={item.quantity || 1}
                                        min="1"
                                        onChange={(event) => handleUpdate(item.product_id, parseInt(event.target.value))}
                                    />
                                </div>
                                <div className="order-item-row">
                                    <label htmlFor={`total-${item.product_id}`}><b>Total:</b></label>
                                    <input
                                        id={`total-${item.product_id}`}
                                        type="number"
                                        value={(item.new_price || 0) * (item.quantity || 1)}
                                        readOnly
                                    />
                                </div>
                                <div className="order-item-actions">
                                    <button
                                        type="button"
                                        className="update-button"
                                        onClick={() => handleUpdate(item.product_id, item.quantity)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => handleDelete(item.product_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                </div>

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>Rs.{getTotalCartAmount() || 0}</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Delivery Fee</p>
                                <p>Rs.200</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Total</p>
                                <p>Rs.{(getTotalCartAmount() || 0) + 200}</p>
                            </div>
                            <div className="proceed-to-payment">
                                <button onClick={handleProceedToPayment}>Proceed to Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
