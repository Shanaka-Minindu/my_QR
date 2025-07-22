import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdvanceQrcontainer from "./components/AdvanceQrcontainer";
import NavBar from "./components/NavBar";
import QrMainContainer from "./components/QrMainContainer";
import QRFrame from "./components/QrFrame";
import Footer from "./components/Footer";

import Login from "./components/login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<QrMainContainer />} />
        <Route path="/advancedQR" element={<AdvanceQrcontainer />} />
        <Route path="/qrFrame" element={<QRFrame/>} />
        <Route path="/login" element ={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;