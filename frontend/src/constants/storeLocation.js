export const STORE_ADDRESS =
  '337/A2, Purana Shivali Road, Kalyanpur, Kanpur, Uttar Pradesh 208017';

export const STORE_ADDRESS_LINES = [
  '337/A2, Purana Shivali Road',
  'Kalyanpur, Kanpur',
  'Uttar Pradesh 208017',
  'India',
];

const encodedAddress = encodeURIComponent(STORE_ADDRESS);

/** Google Maps embed for iframes */
export const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodedAddress}&hl=en&z=16&output=embed`;

/** Opens Google Maps directions to the store */
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

export function openStoreDirections() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodedAddress}`;
        window.open(url, '_blank', 'noopener noreferrer');
      },
      () => {
        window.open(MAP_DIRECTIONS_URL, '_blank', 'noopener noreferrer');
      }
    );
  } else {
    window.open(MAP_DIRECTIONS_URL, '_blank', 'noopener noreferrer');
  }
}
