import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';
import PlaceOrder from './PlaceOrder/PlaceOrder';


function App() {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Shop />} />
                    <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
                    <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
                    <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />} />
                    <Route path='/products/:productId' element={<Product />} />
                    <Route path='/carts' element={<Cart />} />
                    <Route path='/signup' element={<LoginSignup formType="signup" />} />
                    <Route path='/login' element={<LoginSignup formType="login" />} />
                    <Route path='/orders' element={<PlaceOrder />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
