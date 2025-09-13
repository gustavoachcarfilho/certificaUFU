// This file will centralize all API calls.

// The base URL of your Spring Boot backend API.
const API_URL = 'http://localhost:8080';

/**
 * Performs a login request to the backend.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves with the login response data.
 */
export const login = async (email:any, password:any) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Throws an error if the server response is not successful.
    throw new Error('Falha no login. Verifique suas credenciais.');
  }

  // Parses the JSON response from the server.
  return response.json();
};

export const applyToOpportunity = async (opportunityId: string) => {
    const token = localStorage.getItem('authToken');
  
    const response = await fetch(`${API_URL}/opportunity/${opportunityId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Sending the authentication token
      },
    });
  
    if (!response.ok) {
      throw new Error('Falha ao se candidatar à oportunidade.');
    }
  
    return response.json();
  };

  export const validateCertificate = async (certificateId: string, status: 'APPROVED' | 'DENIED', rejectionReason?: string) => {
    const token = localStorage.getItem('authToken');
    const body = {
      status,
      rejectionReason,
    };
  
    const response = await fetch(`${API_URL}/certificate/${certificateId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      throw new Error('Falha ao validar o certificado.');
    }
  
    return response.json();
  };
  
  export const getPendingCertificates = async () => {
      const token = localStorage.getItem('authToken');
  
      const response = await fetch(`${API_URL}/certificate`, { // Assuming GET /certificate returns all
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });
  
      if (!response.ok) {
          throw new Error('Falha ao buscar certificados.');
      }
  
      const allCerts = await response.json();
      // Filter for pending certificates on the client-side for now
      return allCerts.filter(cert => cert.status === 'PENDING');
  };

  export const createCertificate = async (certificateData: object, file: File) => {
    const token = localStorage.getItem('authToken');
    
    // FormData is used to send files and data together.
    const formData = new FormData();
    
    // The backend expects a JSON part named "request". We must create a Blob for it.
    formData.append('request', new Blob([JSON.stringify(certificateData)], { type: 'application/json' }));
    
    // The backend expects a file part named "file".
    formData.append('file', file);
  
    const response = await fetch(`${API_URL}/certificate`, {
      method: 'POST',
      headers: {
        // For multipart/form-data, we don't set Content-Type. The browser does it automatically.
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      // Attempt to get more detailed error info from the response body
      const errorData = await response.json().catch(() => ({ message: 'Falha ao criar o certificado.' }));
      throw new Error(errorData.message || 'Falha ao criar o certificado.');
    }
  
    return response.json();
  };

  export const getMyCertificates = async () => {
    const token = localStorage.getItem('authToken');
  
    const response = await fetch(`${API_URL}/certificate/my-documents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Falha ao buscar os documentos.');
    }
  
    return response.json();
  };

  export const createOpportunity = async (opportunityData: object) => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_URL}/opportunity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(opportunityData),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar a oportunidade.');
  }

  return response.json();
};

export const getAllOpportunities = async () => {
    const token = localStorage.getItem('authToken');
  
    const response = await fetch(`${API_URL}/opportunity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Falha ao buscar as oportunidades.');
    }
  
    return response.json();
  };