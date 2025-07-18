import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceAutocomplete from '../components/PlaceAutocomplete';

function SubmitDeal() {
  const [formData, setFormData] = useState({
    restaurant: '',
    title: '',
    description: '',
    price: '',
    days: '',
    hours: '',
    cuisine: '',
    user: '',
    address: '',
    placeId: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/@me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setFormData(prev => ({ ...prev, user: data.email }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      restaurant: place.name || '',
      address: place.address || '',
      placeId: place.placeId || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    alert(result.message);
    if (res.ok) navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 mb-4 hover:underline text-sm"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-4">Submit a New Deal</h1>

        <p className="text-sm text-gray-500 mb-2">Optional: Search to autofill name & address</p>
        <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="restaurant">
              Restaurant Name
            </label>
            <input
              type="text"
              name="restaurant"
              id="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter restaurant name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Deal Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter deal title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. 5.99"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="days">
              Valid Days
            </label>
            <input
              type="text"
              name="days"
              id="days"
              value={formData.days}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. Mon-Fri"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hours">
              Hours
            </label>
            <input
              type="text"
              name="hours"
              id="hours"
              value={formData.hours}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. 3–7pm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cuisine">
              Cuisine Type
            </label>
            <input
              type="text"
              name="cuisine"
              id="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. Mexican, Italian, etc."
            />
          </div>

          <input type="hidden" name="placeId" value={formData.placeId} />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 font-medium"
          >
            Submit Deal
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitDeal;
