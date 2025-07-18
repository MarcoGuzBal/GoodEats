import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SubmitDeal() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    restaurant: '',
    description: '',
    price: '',
    days: '',
    user: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/@me', {
      method: 'GET',
      credentials: 'include', 
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setUser(data.email);
          setFormData((prevFormData) => ({
            ...prevFormData,
            user: data.email, 
          }));
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 mb-4 hover:underline text-sm"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-4">Submit a New Deal</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'restaurant', label: 'Restaurant Name' },
            { name: 'description', label: 'Description' },
            { name: 'price', label: 'Price' },
            { name: 'days', label: 'Valid Days / Hours' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
                {label}
              </label>
              <input
                type="text"
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

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
