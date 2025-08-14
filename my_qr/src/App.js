import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import AdvanceQrcontainer from "./components/AdvanceQrcontainer";
import NavBar from "./components/NavBar";
import QrMainContainer from "./components/QrMainContainer";
import QRFrame from "./components/QrFrame";
import Footer from "./components/Footer";

import Login from "./components/login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import ContactUs from "./components/ContanctUs";
import QrResult from "./components/QrResult";
import Priceing from "./components/Pricing";


function LayoutWithNavFooter() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutWithNavFooter />}>
          <Route path="/" element={<QrMainContainer />} />
          <Route path="/advancedQR" element={<AdvanceQrcontainer />} />
          <Route path="/qrFrame" element={<QRFrame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/pricing" element={<Priceing/>}/>
        </Route>
        
        <Route path="/qrresult/:id" element={<QrResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
