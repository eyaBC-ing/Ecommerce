import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, Users, LogOut } from 'lucide-react';
import CategoriesAdmin from './components/CategoriesAdmin';
import ProductsAdmin from './components/ProductsAdmin';
import SuppliersAdmin from './components/SuppliersAdmin';
import Login from './components/Login';
import axios from 'axios';
import './index.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authCredentials'));
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios.defaults.headers.common['Authorization'] = `Basic ${localStorage.getItem('authCredentials')}`;
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('authCredentials');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar - Only show if authenticated or you can always show it */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={24} /> Admin Panel
          </h1>
        </div>

        <nav className="nav-links">
          <NavLink to="/categories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FolderTree size={20} />
            Catégories
          </NavLink>

          <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            Produits
          </NavLink>

          <NavLink to="/suppliers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            Fournisseurs
          </NavLink>
        </nav>

        {isAuthenticated && (
          <div style={{ padding: '20px', marginTop: 'auto' }}>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/categories" element={isAuthenticated ? <CategoriesAdmin /> : <Navigate to="/login" />} />
          <Route path="/products" element={isAuthenticated ? <ProductsAdmin /> : <Navigate to="/login" />} />
          <Route path="/suppliers" element={isAuthenticated ? <SuppliersAdmin /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
