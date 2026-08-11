import './App.css'
import Home from './components/Home'
import Landing3D from './components/Landing3D'
import { MyContext } from './components/Mycontext'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from './components/test'
import HomeMod from './components/home-mod'
import Authentication from './components/registration-login'
import { DummyInventoryDashboard } from './admin/sales'
import { YuthiAdminDashboard } from './admin/productadd'
import InitializeNewproduct from './admin/addproduct'


function App() {


  return (
    <>
      <MyContext.Provider value={{}}>
        <BrowserRouter>
          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/landing3d' element={<Landing3D />} />
            <Route path='/test' element={<Test />} />
            <Route path='/homemod' element={<HomeMod />} />
            <Route path='/regi-logi' element={<Authentication />} />
            <Route path='/dashbord' element={<DummyInventoryDashboard />} />
            <Route path='/productlist' element={<YuthiAdminDashboard />} />
            <Route path='/addproduct' element={<InitializeNewproduct />} />

          </Routes>
        </BrowserRouter>
      </MyContext.Provider>

    </>
  )
}

export default App
