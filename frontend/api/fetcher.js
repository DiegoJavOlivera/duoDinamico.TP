const BASE_URL = 'http://localhost:3000/api/';

const apiFetch = async (endpoint, { method = 'GET', headers = {}, body } = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      ...(body && { body: JSON.stringify(body) })
    });
  
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }
