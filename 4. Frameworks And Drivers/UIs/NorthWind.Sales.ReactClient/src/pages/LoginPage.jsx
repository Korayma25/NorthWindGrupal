import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { keepLoginCharacters } from '../domain/validators/textRules';
import useFilteredInput from '../domain/validators/useFilteredInput';
import es from '../i18n/es';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const emailInput = useFilteredInput({
    value: email,
    setValue: setEmail,
    filterFn: keepLoginCharacters,
    maxLength: 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(es.membership.validationErrors?.emailRequired || 'Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      navigate('/pos');
    } catch (err) {
      setError(err.response?.data?.message || es.membership.loginFailed || 'Error al iniciar sesión. Verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0" style={{ width: '400px' }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="mb-0 fw-bold">{es.membership.appName || 'Sistema de Facturación'}</h4>
          <small>{es.membership.loginTitle || 'Iniciar Sesión'}</small>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label fw-semibold">
                {es.membership.emailLabel || 'Correo Electrónico'}
              </label>
              <input
                ref={emailInput.inputRef}
                id="emailInput"
                type="text"
                inputMode="email"
                className="form-control"
                placeholder={es.membership.emailPlaceholder || 'Ej. admin@northwind.com'}
                value={email}
                onChange={emailInput.handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="passwordInput" className="form-label fw-semibold">
                {es.membership.passwordLabel || 'Contraseña'}
              </label>
              <input
                id="passwordInput"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {es.common.loading || 'Ingresando...'}
                </>
              ) : (
                es.membership.loginButton || 'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-3 text-center d-flex flex-column gap-1">
            <small className="text-muted">
              {es.membership.credentialsHelp || 'Ingrese sus credenciales de usuario registradas'}
            </small>
            <small>
              ¿No tiene una cuenta?{' '}
              <Link to="/register" className="fw-semibold text-decoration-none">
                {es.common.createAccountText || 'Registrarse'}
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

