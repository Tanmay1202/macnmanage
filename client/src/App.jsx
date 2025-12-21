import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Production from './pages/Production';

import { ToastProvider } from './context/ToastContext';

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <ToastProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/production" element={<Production />} />
                </Routes>
            </ToastProvider>
        </div>
    );
}

export default App;
