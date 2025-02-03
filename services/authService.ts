import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Remarque : Si tu déploies sur Vercel, l'URL doit être modifiée en conséquence.

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};
