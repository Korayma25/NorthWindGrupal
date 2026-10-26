import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { keepLetters, keepLoginCharacters } from '../domain/validators/textRules';
import useFilteredInput from '../domain/validators/useFilteredInput';
import es from '../i18n/es';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  // Filtered inputs preserving cursor position
  const { inputRef: firstNameRef, handleChange: handleFirstNameChange } = useFilteredInput({
    value: firstName,
    setValue: setFirstName,
    filterFn: keepLetters,
    maxLength: 40,
  });

  const { inputRef: lastNameRef, handleChange: handleLastNameChange } = useFilteredInput({
    value: lastName,
    setValue: setLastName,
    filterFn: keepLetters,
    maxLength: 40,
  });

  const { inputRef: emailRef, handleChange: handleEmailChange } = useFilteredInput({
    value: email,
    setValue: setEmail,
    filterFn: keepLoginCharacters,
    maxLength: 100,
  });

  const validateForm = () => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = es.membership.requiredFirstNameErrorMessage;
    }

    if (!lastName.trim()) {
      errors.lastName = es.membership.requiredLastNameErrorMessage;
    }

    if (!email.trim()) {
      errors.email = es.membership.requiredEmailErrorMessage;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = es.membership.invalidEmailErrorMessage;
    }

    if (!password) {
      errors.password = es.membership.requiredPasswordErrorMessage;
    } else if (password.length < 6) {
      errors.password = es.membership.passwordTooShortErrorMessage;
    } else if (!/[a-z]/.test(password)) {
      errors.password = es.membership.passwordRequiresLowerErrorMessage;
    } else if (!/[A-Z]/.test(password)) {
      errors.password = es.membership.passwordRequiresUpperErrorMessage;
    } else if (!/\d/.test(password)) {
      errors.password = es.membership.passwordRequiresDigitErrorMessage;
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.password = es.membership.passwordRequiresNonAlphanumericErrorMessage;
    }

    if (!passwordConfirmation) {
      errors.passwordConfirmation = es.membership.requiredPasswordErrorMessage;
    } else if (password !== passwordConfirmation) {
      errors.passwordConfirmation = es.membership.confirmPasswordErrorMessage;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMessage(es.membership.registeredUserMessage);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setFieldErrors({});

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData && typeof responseData === 'object') {
        const serverFieldErrors = {};
        for (const [key, msg] of Object.entries(responseData)) {
          const lower = key.toLowerCase();
          if (lower.includes('firstname')) {
            serverFieldErrors.firstName = Array.isArray(msg) ? msg[0] : msg;
          } else if (lower.includes('lastname')) {
            serverFieldErrors.lastName = Array.isArray(msg) ? msg[0] : msg;
          } else if (lower.includes('email')) {
            serverFieldErrors.email = Array.isArray(msg) ? msg[0] : msg;
          } else if (lower.includes('passwordconfirmation')) {
            serverFieldErrors.passwordConfirmation = Array.isArray(msg) ? msg[0] : msg;
          } else if (lower.includes('password')) {
            serverFieldErrors.password = Array.isArray(msg) ? msg[0] : msg;
          }
        }
        if (Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors);
        } else {
          setGeneralError(responseData.message || es.errors.genericErrorMessage);
        }
      } else {
        setGeneralError(err.response?.data?.message || err.message || es.errors.genericErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="card shadow-lg border-0" style={{ width: '460px' }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="mb-0 fw-bold">{es.common.navBarBrandTitle}</h4>
          <small>{es.membership.registerTitle}</small>
        </div>
        <div className="card-body p-4">
          {generalError && (
            <div className="alert alert-danger p-2 small text-center">{generalError}</div>
          )}

          {successMessage && (
            <div className="alert alert-success p-2 small text-center">{successMessage}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label htmlFor="registerFirstNameInput" className="form-label fw-semibold small mb-1">
                  {es.membership.firstNameLabel}
                </label>
                <input
                  id="registerFirstNameInput"
                  ref={firstNameRef}
                  type="text"
                  className={`form-control ${fieldErrors.firstName ? 'is-invalid' : ''}`}
                  value={firstName}
                  onChange={handleFirstNameChange}
                  maxLength="40"
                  required
                />
                {fieldErrors.firstName && (
                  <div className="invalid-feedback small">{fieldErrors.firstName}</div>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="registerLastNameInput" className="form-label fw-semibold small mb-1">
                  {es.membership.lastNameLabel}
                </label>
                <input
                  id="registerLastNameInput"
                  ref={lastNameRef}
                  type="text"
                  className={`form-control ${fieldErrors.lastName ? 'is-invalid' : ''}`}
                  value={lastName}
                  onChange={handleLastNameChange}
                  maxLength="40"
                  required
                />
                {fieldErrors.lastName && (
                  <div className="invalid-feedback small">{fieldErrors.lastName}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="registerEmailInput" className="form-label fw-semibold small mb-1">
                {es.membership.emailLabel}
              </label>
              <input
                id="registerEmailInput"
                ref={emailRef}
                type="text"
                inputMode="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={handleEmailChange}
                maxLength="100"
                required
              />
              {fieldErrors.email && (
                <div className="invalid-feedback small">{fieldErrors.email}</div>
              )}
            </div>

            {/* Passwords are NOT filtered */}
            <div className="mb-3">
              <label htmlFor="registerPasswordInput" className="form-label fw-semibold small mb-1">
                {es.membership.passwordLabel}
              </label>
              <input
                id="registerPasswordInput"
                type="password"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {fieldErrors.password && (
                <div className="invalid-feedback small">{fieldErrors.password}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="registerConfirmPasswordInput" className="form-label fw-semibold small mb-1">
                {es.membership.passwordConfirmationLabel}
              </label>
              <input
                id="registerConfirmPasswordInput"
                type="password"
                className={`form-control ${fieldErrors.passwordConfirmation ? 'is-invalid' : ''}`}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
              {fieldErrors.passwordConfirmation && (
                <div className="invalid-feedback small">{fieldErrors.passwordConfirmation}</div>
              )}
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
                  {es.common.loading}
                </>
              ) : (
                es.membership.registerButtonText
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            <small className="text-muted">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary fw-semibold">
                {es.membership.loginButtonText}
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
