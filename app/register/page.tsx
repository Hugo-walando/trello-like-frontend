'use client';

import React, { useState } from 'react';
import { registerUser } from '../../services/authService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, email, password);
      console.log('Utilisateur créé avec succès:', data);
      // Tu peux rediriger vers la page de connexion ou la page d'accueil
    } catch (err) {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit'>S'inscrire</button>
      </form>
    </div>
  );
};

export default Signup;
