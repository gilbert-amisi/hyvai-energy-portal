import api from '@/lib/api';

// --- CRUD PRODUCTS ---
export const getProducts = async () => {
  try {
    // On demande à Strapi les produits avec tous leurs composants (images incluses)
    const response = await api.get('/products?populate=*');
    return response.data.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
};

export const deleteProduct = async (documentId: string) => {
  try {
    const response = await api.delete(`/products/${documentId}`);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return false;
  }
};

// --- CRUD SYSTEMS ---
export const getHomeGrids = async () => {
  try {
    // On appelle la nouvelle table 'home-grids'
    const response = await api.get('/home-grids?populate=*');
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des Home-grids:", error);
    return [];
  }
};

export const deleteHomeGrid = async (documentId: string) => {
  try {
    const response = await api.delete(`/home-grids/${documentId}`);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error("Erreur suppression home-grid:", error);
    return false;
  }
};

// --- QUOTE REQUESTS ---

export const sendQuoteRequest = async (quoteData: any) => {
  try {
    // Strapi 5 attend les données enveloppées dans un objet "data"
    const response = await api.post('/product-quotes', { data: quoteData });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du devis:", error);
    throw error;
  }
};

export const sendSolutionQuoteRequest = async (quoteData: any) => {
  try {
    // Strapi 5 attend les données enveloppées dans un objet "data"
    const response = await api.post('/solution-quotes', { data: quoteData });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du devis:", error);
    throw error;
  }
};

export const getProductQuotes = async () => {
  try {
    const response = await api.get('/product-quotes?populate=*');
    return response.data.data;
  } catch (error) {
    console.error("Erreur récupération product-quotes:", error);
    return [];
  }
};

/** Récupère les demandes de devis pour les systèmes (Solutions) */
export const getSolutionQuotes = async () => {
  try {
    const response = await api.get('/solution-quotes?populate=*');
    return response.data.data;
  } catch (error) {
    console.error("Erreur récupération solution-quotes:", error);
    return [];
  }
};

export const getPartners = async () => {
  try {
    const response = await api.get('/partners?populate=*');
    return response.data.data;
  } catch (error) {
    console.error("Erreur récupération des partenaires:", error);
    return [];
  }
};
export const deletePartner = async (documentId: string) => {
  try {
    const response = await api.delete(`/partners/${documentId}`);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error("Erreur suppression partenaire:", error);
    return false;
  }
};
