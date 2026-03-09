import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree } from 'lucide-react';
import CategoriesAdmin from './components/CategoriesAdmin';
import ProductsAdmin from './components/ProductsAdmin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={24} /> Admin Panel
            </h1>
          </div>

          <nav className="nav-links">
            <NavLink
              to="/categories"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <FolderTree size={20} />
              Catégories
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <ShoppingBag size={20} />
              Produits
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/categories" element={<CategoriesAdmin />} />
            <Route path="/products" element={<ProductsAdmin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
