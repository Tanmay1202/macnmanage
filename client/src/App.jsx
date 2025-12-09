import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/inventory" element={<Inventory />} />
            </Routes>
        </div>
    );
}

export default App;
