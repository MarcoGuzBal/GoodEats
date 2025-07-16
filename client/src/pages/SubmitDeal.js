import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SubmitDeal() {
  const [formData, setFormData] = useState({
    restaurant: '',
    description: '',
    price: '',
    days: '',
    user: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Home
      </button>

      <h1 className="text-2xl font-bold mb-4">Submit a New Deal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['restaurant', 'description', 'price', 'days', 'user'].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        ))}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Submit Deal
        </button>
      </form>
    </div>
  );
}

export default SubmitDeal;
