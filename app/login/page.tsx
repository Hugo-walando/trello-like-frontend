'use client';

import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log('Connexion réussie:', data);
      // Stocke le token dans le localStorage ou un cookie si nécessaire
      localStorage.setItem('token', data.token);
      // Redirige vers la page d'accueil ou une autre page après connexion
      router.push('/');
    } catch (err) {
      setError('Erreur lors de la connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
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
        <button type='submit'>Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
