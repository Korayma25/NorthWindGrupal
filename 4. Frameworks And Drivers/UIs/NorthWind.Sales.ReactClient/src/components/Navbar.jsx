import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!authService.isAuthenticated() || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/pos">
          Sistema de facturación
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/pos' ? 'active fw-semibold' : ''}`}
                to="/pos"
              >
                Punto de Venta
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.startsWith('/invoices') ? 'active fw-semibold' : ''}`}
                to="/invoices"
              >
                Facturas Emitidas
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="text-light small">
              Usuario: <strong>{user?.email || user?.username || 'Usuario'}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
              type="button"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
