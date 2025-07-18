import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placeDetails, setPlaceDetails] = useState(null);

  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    fetch(`http://localhost:5000/api/deals/${id}`)
      .then(res => res.json())
      .then(data => {
        setDeal(data);
        setLoading(false);

        if (data.placeId) {
          fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.placeId}&fields=name,rating,formatted_phone_number,photos&key=${GOOGLE_API_KEY}`)
            .then(res => res.json())
            .then(result => {
              if (result.status === 'OK') {
                setPlaceDetails(result.result);
              }
            })
            .catch(err => console.error('Place details error:', err));
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const getPhotoUrl = (photoRef) =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!deal) return <div className="p-6 text-center text-red-500">Deal not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 mb-4 hover:underline text-sm"
        >
          ← Back to Home
        </button>

        {placeDetails?.photos?.length && (
          <img
            src={getPhotoUrl(placeDetails.photos[0].photo_reference)}
            alt="Restaurant"
            className="rounded-lg mb-4 w-full h-64 object-cover"
          />
        )}

        <h1 className="text-3xl font-bold text-green-700 mb-2">{deal.title || 'Untitled Deal'}</h1>
        <p className="text-lg text-gray-800 mb-1 font-semibold">{deal.restaurant || 'Unknown Restaurant'}</p>

        <div className="text-gray-600 mt-2 space-y-2">
          <p><span className="font-medium">Price:</span> ${deal.price ?? 'N/A'}</p>
          <p><span className="font-medium">Description:</span> {deal.description || 'No description provided.'}</p>
          <p><span className="font-medium">Valid Days:</span> {deal.days || 'N/A'}</p>
          <p><span className="font-medium">Hours:</span> {deal.hours || 'N/A'}</p>
          <p><span className="font-medium">Cuisine:</span> {deal.cuisine || 'N/A'}</p>
          <p><span className="font-medium">Address:</span> {deal.address || 'N/A'}</p>
          {placeDetails?.formatted_phone_number && (
            <p><span className="font-medium">Phone:</span> {placeDetails.formatted_phone_number}</p>
          )}
          {placeDetails?.rating && (
            <p><span className="font-medium">Google Rating:</span> {placeDetails.rating} ⭐</p>
          )}
        </div>

        {deal.placeId && (
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${deal.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}

export default DealDetails;
