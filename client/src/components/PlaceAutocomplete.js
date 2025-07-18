import React, { useEffect, useRef } from 'react';

function PlaceAutocomplete({ onPlaceSelect }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const loadScript = (url, callback) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.body.appendChild(script);
        script.onload = callback;
      } else {
        callback();
      }
    };

    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        componentRestrictions: { country: 'us' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (place.types && place.types.includes('restaurant')) {
          const name = place.name || '';
          const address = place.formatted_address || '';
          const placeId = place.place_id || '';
          onPlaceSelect({ name, address, placeId });
        } else {
          alert('Please select a restaurant.');
        }
      });
    };

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`, initAutocomplete);
  }, [onPlaceSelect]);

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Search for a restaurant"
      className="w-full border border-gray-300 p-2 rounded mb-4"
    />
  );
}

export default PlaceAutocomplete;
