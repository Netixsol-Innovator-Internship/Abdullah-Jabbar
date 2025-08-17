// App.jsx
import { Routes, Route } from "react-router-dom";   // <-- missing import
import Footer from "./components/Footer";
import LandingPage from "./pages/landingPage";

export default function App() {
  return( 
  
  <Routes>  
 <Route path="/login" element={<Footer />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
