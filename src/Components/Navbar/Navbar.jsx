import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import search_icon from '../Assets/search_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [menu, setmenu] = useState("shop");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {gettotalCartItems} = useContext(ShopContext);

  const toggleSearchBar = () => {
    setSearchVisible(!isSearchVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt=""/>
            <p>AS3 SHOPPER</p>
        </div>
        
        {/* Hamburger Menu Button */}
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
            <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
            <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
            <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
        </div>
        
        {/* Regular Menu (will be hidden on mobile) */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
            <li onClick={()=>{setmenu("shop"); setMobileMenuOpen(false);}}>
                <Link style={{textDecoration:'none'}}to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}
            </li>
            <li onClick={()=>{setmenu("mens"); setMobileMenuOpen(false);}}>
                <Link style={{textDecoration:'none'}} to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}
            </li>
            <li onClick={()=>{setmenu("womens"); setMobileMenuOpen(false);}}>
                <Link style={{textDecoration:'none'}} to='womens'>Women</Link>{menu==="womens"?<hr/>:<></>}
            </li>
            <li onClick={()=>{setmenu("kids"); setMobileMenuOpen(false);}}>
                <Link style={{textDecoration:'none'}} to='kids'>Kids</Link>{menu==="kid"?<hr/>:<></>}
            </li>
        </ul>
        
        <div className="nav-login-cart">
            <Link to='/login'><button className="login-button">LOGIN</button></Link>
            
            <img 
              src={search_icon} 
              alt="Search" 
              className="nav-search-icon" 
              onClick={toggleSearchBar} 
            />
            {isSearchVisible && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-bar" 
                autoFocus
              />
            )}
            <Link to='/carts'><img src={cart_icon} alt=""/></Link>
            
            <div className="nav-cart-count">{gettotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar
