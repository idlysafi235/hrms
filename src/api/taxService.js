import { BASE_URL } from './urls';


export const fetchTaxSlabs = async (token) => {
  const res = await fetch(`${BASE_URL}/tax/slabs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to load tax configs');
  }

  return Array.isArray(data) ? data : [];
};


export const createTaxSlabs = async (token, body) => {
  const res = await fetch(`${BASE_URL}/tax/slabs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Create failed');
  }

  return data;
};


export const deleteTaxSlabs = async (token, id) => {
  const res = await fetch(`${BASE_URL}/tax/slabs/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Delete failed');
  }

  return data;
};

export const fetchTaxConfigs = async (token) => {
  const res = await fetch(`${BASE_URL}/tax/config`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to load tax configs');
  }

  return Array.isArray(data) ? data : [];
};


export const createTaxConfig = async (token, body) => {
  const res = await fetch(`${BASE_URL}/tax/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Create failed');
  }

  return data;
};


export const deleteTaxConfig = async (token, id) => {
  const res = await fetch(`${BASE_URL}/tax/config/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Delete failed');
  }

  return data;
};

export const fetchTaxSlabsByRegimeYear = async (token, taxRegime, financialYear) => {
  const res = await fetch(`${BASE_URL}/tax/slabs/search?taxRegime=${taxRegime}&financialYear=${financialYear}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to load tax slabs');
  return data;
};

export const fetchTaxConfigSingle = async (token, taxRegime, financialYear) => {
  const res = await fetch(`${BASE_URL}/tax/config/single?taxRegime=${taxRegime}&financialYear=${financialYear}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to load tax config');
  return data;
};
