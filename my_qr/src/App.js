import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdvanceQrcontainer from "./components/AdvanceQrcontainer";
import NavBar from "./components/NavBar";
import QrMainContainer from "./components/QrMainContainer";
import QRFrame from "./components/QrFrame";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<QrMainContainer />} />
        <Route path="/advancedQR" element={<AdvanceQrcontainer />} />
        <Route path="/qrFrame" element={<QRFrame/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;