import { BASE_URL } from './urls';


const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Request failed');
  }
  return await res.json();
};

export const fetchAnnouncements = async (token) => {
  const res = await fetch(`${BASE_URL}/general/announcements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const createAnnouncement = async (token, title, description) => {
  const res = await fetch(`${BASE_URL}/general/announcements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(res);
};

export const deleteAnnouncement = async (token, id) => {
  const res = await fetch(`${BASE_URL}/general/announcements/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const updateAnnouncement = async (token, id, title, description) => {
  const bodyData = {};
  if (title !== undefined) bodyData.title = title;
  if (description !== undefined) bodyData.description = description;

  const res = await fetch(`${BASE_URL}/general/announcements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyData),
  });

  if (!res.ok) {
    throw new Error('Update failed');
  }
  return res.json();
};



export const fetchEvents = async (token) => {
  const res = await fetch(`${BASE_URL}/general/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const createEvent = async (token, title, eventDate, eventTime) => {

  const res = await fetch(`${BASE_URL}/general/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, eventDate, eventTime }),
  });
  return handleResponse(res);
};


export const updateEvent = async (token, id, title, date, time) => {
  const res = await fetch(`${BASE_URL}/general/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, eventDate: date, eventTime: time }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to update event";
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      }
    } catch (_) {}

    throw new Error(errorMessage);
  }
};



export const deleteEvent = async (token, id) => {
  const res = await fetch(`${BASE_URL}/general/events/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};



export const fetchHolidays = async (token) => {
  const res = await fetch(`${BASE_URL}/general/holidays`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const createHoliday = async (token, name, holidayDate) => {
  const res = await fetch(`${BASE_URL}/general/holidays`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, holidayDate }),
  });
  return handleResponse(res);
};

export const deleteHoliday = async (token, id) => {
  const res = await fetch(`${BASE_URL}/general/holidays/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};


export const fetchTds = async (token) => {
  const res = await fetch(`${BASE_URL}/general/tds`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};