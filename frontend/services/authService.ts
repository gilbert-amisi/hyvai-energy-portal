import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const login = async (identifier: string, password: string) => {
  try {
    const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
      identifier,
      password,
    });
    
    if (response.data.jwt) {
      localStorage.setItem('token', response.data.jwt);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NOUVELLE FONCTION POUR RÉCUPÉRER LE RÔLE SÛREMENT
export const getMe = async (token: string) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mise à jour des identifiants (Table User de Strapi)
export const updateCredentials = async (userId: string, data: any, token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  };
  
  // Mise à jour du profil (Table Trainee-Profile)
  export const updateTraineeProfile = async (profileDocId: string, data: any, token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trainee-profiles/${profileDocId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }), // Strapi wrap les contenus dans "data" pour les Content-Types
    });
    return res.json();
  };