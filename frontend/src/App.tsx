import './App.css';
import Home from './components/Home';
import Landing3D from './components/Landing3D';
import { MyContext } from './components/Mycontext';
import { CartProvider } from './components/CartContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Test from './components/test';
import HomeMod from './components/home-mod';
import Authentication from './components/registration-login';

import { YuthiAdminDashboard } from './admin/productadd';
import InitializeNewproduct from './admin/addproduct';
import Cartpage from './components/cart';
import Profile from './components/profile';
import ProductList from './components/productlist';
import PaymentSuccess from './components/PaymentSuccess';
import { YuthiOrdersDashboard } from './admin/orders';
import { AdminLayout } from './admin/AdminLayout';
import { useState } from 'react';
import axios from 'axios';
import { YuthiAdminDashboardreal } from './admin/dashboard'

function App() {
  const [user, setUser] = useState();
  const access = async () => {
    try {
      await axios.get("user");
    } catch (err) {
      console.log("something went wrong ");
    }
  };

  return (
    <MyContext.Provider value={{}}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<HomeMod />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path='/home' element={<Home />} />
            <Route path='/landing3d' element={<Landing3D />} />
            <Route path='/test' element={<Test />} />
            <Route path='/homemod' element={<HomeMod />} />
            <Route path='/regi-logi' element={<Authentication />} />
            <Route path='/cart' element={<Cartpage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/productlist' element={<ProductList />} />

            {/* Admin Layout & Nested Routes with URL structures */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<YuthiAdminDashboardreal />} />
              <Route path="products" element={<YuthiAdminDashboard />} />
              <Route path="add-product" element={<InitializeNewproduct />} />
              <Route path="orders" element={<YuthiOrdersDashboard />} />
              <Route path="reports" element={<div className="p-8">Reports Analytics View</div>} />
              <Route path="customers" element={<div className="p-8">Customer Management View</div>} />
              <Route path="settings" element={<div className="p-8">Admin Settings View</div>} />
            </Route>

            {/* Backward-compatible redirects or direct routes if needed */}
            <Route path='/dashbord' element={<Navigate to="/admin/dashboard" replace />} />
            <Route path='/productListAdmin' element={<Navigate to="/admin/products" replace />} />
            <Route path='/addproductAdmin' element={<Navigate to="/admin/add-product" replace />} />
            <Route path='/adminOrders' element={<Navigate to="/admin/orders" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </MyContext.Provider>
  );
}

export default App;