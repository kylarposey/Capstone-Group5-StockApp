//import logo from './logo.svg';
import About from './Components/About';
import LoginPage from './Components/LoginPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Header from './Components/Header';



// Placeholder functions
// Replace these functions with react components in separate files
function Home() {
  return <h1>Home Page</h1>;
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
	return (
		<BrowserRouter> {/* Use BrowserRouter, not Router */}
			<Header />
			<div className="container mt-4">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<NotFound />} /> {/* Catch-all route for unknown pages */}
			</Routes>
			</div>
		</BrowserRouter>

	);
}

export default App;
