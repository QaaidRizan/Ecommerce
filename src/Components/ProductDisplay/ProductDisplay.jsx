import React, { useState, useContext } from 'react';
import './ProductDisplay.css';
import start_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    const [selectedSize, setSelectedSize] = useState(null);  // Track selected size
    const [error, setError] = useState(null);  // Track validation error

    // Handle size selection and reset error state
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setError(null);  // Clear error when a size is selected
    };

    // Handle add to cart with validation
    const handleAddToCart = () => {
        if (selectedSize) {
            addToCart(product.id, selectedSize);
        } else {
            setError('Please select a size');  // Show error if no size is selected
        }
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-main-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={start_icon} alt="" />
                    <img src={start_icon} alt="" />
                    <img src={start_icon} alt="" />
                    <img src={start_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">Rs. {product.old_price}</div>
                    <div className="productdisplay-right-price-new">Rs. {product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    A lightweight, usually knitted, pullover shirt
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <div
                                key={size}
                                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => handleSizeSelect(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                    {error && <p className='error-message'>{error}</p>}  {/* Show error message */}
                </div>
                <button onClick={handleAddToCart} className='productdisplay-right-button'>
                    ADD TO CART
                </button>
                <p className='productdisplay-right-category'><span>Category : </span>Women, T-Shirt, Crop Top</p>
                <p className='productdisplay-right-category'><span>Tag : </span>Modern, Latest</p>
            </div>
        </div>
    );
};

export default ProductDisplay;
