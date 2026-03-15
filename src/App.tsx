import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
