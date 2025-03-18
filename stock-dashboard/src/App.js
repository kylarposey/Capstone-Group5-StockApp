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
import Trending from "./Components/Trending";
import PortfolioCreation from './Components/PortfolioCreation';




// Placeholder functions
// Replace these functions with react components in separate files
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
    return (
        <div className="app-container">
            <BrowserRouter>
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/newUser" element={<NewUser />} />
                        <Route path="/trends" element={<Trending />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/PortfolioCreation" element={<PortfolioCreation />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;