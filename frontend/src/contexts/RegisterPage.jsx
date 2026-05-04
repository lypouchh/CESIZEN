import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await register(firstname, lastname, email, password, passwordConfirmation);
      navigate('/'); // Redirige vers la page d'accueil après inscription
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription. Vérifiez vos informations.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Prénom" required />
        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Nom" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
        <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirmer le mot de passe" required />
        <button type="submit">S'inscrire</button>
      </form>
      <p>Déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
    </div>
  );
};

export default RegisterPage;