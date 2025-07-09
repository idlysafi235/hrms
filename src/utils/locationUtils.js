export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err)
    );
  });

export const reverseGeocode = async (lat, long) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`,
      {
       
      }
    );

    const data = await res.json();
    const address = data.address || {};

    const city = address.city || address.town || address.village || address.suburb || 'Unknown';
    const country = address.country || '';

    return `${city}, ${country}`.trim();
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return 'Unknown location';
  }
};
