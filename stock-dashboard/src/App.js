import About from './Components/About';
import LoginPage from './Components/LoginPage';
import NewUser from './Components/newUser'; // Ensure correct import
import './assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from "./Components/Home";
import Footer from './Components/Footer';

// Placeholder functions
// Replace these functions with react components in separate files
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/newUser" element={<NewUser />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;