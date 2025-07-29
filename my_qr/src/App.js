import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import AdvanceQrcontainer from "./components/AdvanceQrcontainer";
import NavBar from "./components/NavBar";
import QrMainContainer from "./components/QrMainContainer";
import QRFrame from "./components/QrFrame";
import Footer from "./components/Footer";

import Login from "./components/login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import ContactUs from "./components/ContanctUs";
import { AuthContext } from "./store/user_auth_context";

function App() {
  return (
    <BrowserRouter>
      <AuthContext value={{userEmail: null}}>
        <NavBar />
        <Routes>
          <Route path="/" element={<QrMainContainer />} />
          <Route path="/advancedQR" element={<AdvanceQrcontainer />} />
          <Route path="/qrFrame" element={<QRFrame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/contactus" element={<ContactUs />} />
        </Routes>
        <Footer />
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
