import './App.css';
import Home from './components/Home';
import Landing3D from './components/Landing3D';
import { MyContext } from './components/Mycontext';
import { CartProvider } from './components/CartContext';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Test from './components/test';
import HomeMod from './components/home-mod';
import Authentication from './components/registration-login';
import { DummyInventoryDashboard } from './admin/sales';
import { YuthiAdminDashboard } from './admin/productadd';
import InitializeNewproduct from './admin/addproduct';
import Cartpage from './components/cart';
import Profile from './components/profile';
import ProductList from './components/productlist';
import PaymentSuccess from './components/PaymentSuccess';


function App() {

  const token = localStorage.getItem("accessToken");

  return (
    <>
      <MyContext.Provider value={{}}>
        <CartProvider>

          <BrowserRouter>

            <Routes>

              {/* Public routes */}
              <Route path="/regi-logi" element={<Authentication />} />

              {/* Home */}
              <Route
                path="/"
                element={
                  token ? <HomeMod /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/home"
                element={
                  token ? <Home /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/landing3d"
                element={
                  token ? <Landing3D /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/test"
                element={
                  token ? <Test /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/homemod"
                element={
                  token ? <HomeMod /> : <Navigate to="/regi-logi" replace />
                }
              />

              {/* Admin */}
              <Route
                path="/dashbord"
                element={
                  token
                    ? <DummyInventoryDashboard />
                    : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/productListAdmin"
                element={
                  token
                    ? <YuthiAdminDashboard />
                    : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/addproductAdmin"
                element={
                  token
                    ? <InitializeNewproduct />
                    : <Navigate to="/regi-logi" replace />
                }
              />

              {/* User pages */}
              <Route
                path="/cart"
                element={
                  token ? <Cartpage /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/profile"
                element={
                  token ? <Profile /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/productlist"
                element={
                  token ? <ProductList /> : <Navigate to="/regi-logi" replace />
                }
              />

              <Route
                path="/payment-success"
                element={
                  token
                    ? <PaymentSuccess />
                    : <Navigate to="/regi-logi" replace />
                }
              />

              {/* Unknown route */}
              <Route
                path="*"
                element={<Navigate to={token ? "/" : "/regi-logi"} replace />}
              />

            </Routes>

          </BrowserRouter>

        </CartProvider>
      </MyContext.Provider>
    </>
  );
}

export default App;