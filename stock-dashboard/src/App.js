import About from './Components/About';
// remove the "eslint-disable-next-line" below once LoginPage is implemented
// eslint-disable-next-line
import LoginPage from './Components/LoginPage';
import './assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from "./Components/Home";
import Footer from './Components/Footer';
import NewUser from './Components/newUser';




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
                <Route path="*" element={<NotFound />} />
                <Route path="/newUser" element={<NewUser />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;