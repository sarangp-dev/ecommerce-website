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
import { Component, type ReactNode } from 'react';
import { YuthiAdminDashboardreal } from './admin/dashboard';

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface EBState { hasError: boolean; message: string; }

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#FFF8F0', color: '#3D404C',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          padding: '2rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>⚠️</div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif', fontSize: '2rem',
            fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em',
          }}>
            Something went wrong
          </h1>
          <p style={{ color: '#696B75', fontSize: '0.95rem', maxWidth: '460px', lineHeight: 1.7, marginBottom: '2rem' }}>
            An unexpected error occurred. Please refresh the page or contact support if the issue persists.
          </p>
          <code style={{
            display: 'block', background: '#F7F0E2', border: '1px solid #D0C5AF',
            borderRadius: '10px', padding: '0.75rem 1.25rem', fontSize: '0.78rem',
            color: '#735C00', maxWidth: '500px', wordBreak: 'break-word', marginBottom: '2rem',
          }}>
            {this.state.message || 'Unknown error'}
          </code>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #735C00)', border: 'none',
              color: '#FFF8F0', padding: '0.9rem 2rem', borderRadius: '11px',
              fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.04em',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <ErrorBoundary>
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

              {/* Admin Layout & Nested Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<YuthiAdminDashboardreal />} />
                <Route path="products" element={<YuthiAdminDashboard />} />
                <Route path="add-product" element={<InitializeNewproduct />} />
                <Route path="orders" element={<YuthiOrdersDashboard />} />
                <Route path="reports" element={<div className="p-8 text-[#3D404C] font-sans">Reports Analytics — Coming Soon</div>} />
                <Route path="customers" element={<div className="p-8 text-[#3D404C] font-sans">Customer Management — Coming Soon</div>} />
                <Route path="settings" element={<div className="p-8 text-[#3D404C] font-sans">Admin Settings — Coming Soon</div>} />
              </Route>

              {/* Backward-compatible redirects */}
              <Route path='/dashbord' element={<Navigate to="/admin/dashboard" replace />} />
              <Route path='/productListAdmin' element={<Navigate to="/admin/products" replace />} />
              <Route path='/addproductAdmin' element={<Navigate to="/admin/add-product" replace />} />
              <Route path='/adminOrders' element={<Navigate to="/admin/orders" replace />} />

              {/* 404 Fallback */}
              <Route path="*" element={
                <div style={{
                  minHeight: '100vh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: '#FFF8F0', fontFamily: 'Outfit, sans-serif', color: '#3D404C',
                }}>
                  <div style={{ fontSize: '5rem', fontWeight: 900, color: '#D4AF37' }}>404</div>
                  <p style={{ fontSize: '1.1rem', color: '#696B75', margin: '0.5rem 0 2rem' }}>Page not found</p>
                  <a href="/" style={{
                    background: 'linear-gradient(135deg, #D4AF37, #735C00)', color: '#FFF8F0',
                    padding: '0.9rem 2rem', borderRadius: '11px', textDecoration: 'none',
                    fontWeight: 700, fontSize: '0.95rem',
                  }}>← Back to Home</a>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </MyContext.Provider>
    </ErrorBoundary>
  );
}

export default App;