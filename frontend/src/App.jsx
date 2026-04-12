import React, { useContext } from 'react'
import {Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Collection from './pages/collection';
import Navbar from './components/navber';
import Contact from './pages/contact';
import Login from './pages/login';
import Cart from './pages/cart';
import Order from './pages/order';
import Placeorder from './pages/placeorder';
import Product from './pages/product';
import Footer from './components/footer';
import Search from './components/search';
import Profile from './pages/profile';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Shopcontext } from './context/shopcontext';


const App = () => {
  const { token } = useContext(Shopcontext)
  const isAuthenticated = Boolean(token)

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen text-black font-outfit'>
        <ToastContainer />
        <Login />
      </div>
    )
  }

  return (
    <div className='min-h-screen text-black font-outfit'>
      <ToastContainer />
      <Navbar />
      <Search />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/order' element={<Order />} />
        <Route path='/placeorder' element={<Placeorder />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
      </Routes >
      <Footer />
    </div>
  )
}

export default App

