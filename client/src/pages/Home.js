import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [user, setUser] = useState(null);
  const [openNow, setOpenNow] = useState(false);
  const [radius, setRadius] = useState('5');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/deals')
      .then((res) => res.json())
      .then((data) => {
        setDeals(data);
        setFilteredDeals(data);
      })
      .catch((err) => console.error("Error fetching deals:", err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/@me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('Response data:', data);
        if (data.error) {
          console.error(data.error);
        } else {
          setUser(data); 
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include', 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); 
        setUser(null); 
      })
      .catch((error) => console.error('Error logging out:', error));
  };

  function vote(type, id) {
    fetch(`http://localhost:5000/api/deals/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ vote: type }),
    })
    .then(res => res.json())
    .then(data => console.log(data));
  }

  const applyFilters = () => {
    const now = new Date();
    let result = [...deals];

    if (cuisineFilter !== 'All') {
      result = result.filter(deal => deal.cuisine === cuisineFilter);
    }

    if (locationFilter) {
      result = result.filter(deal =>
        deal.location && deal.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (openNow) {
      result = result.filter(deal => {
        const [start, end] = (deal.hours || '').split('-');
        if (!start || !end) return false;
        const nowHour = now.getHours();
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        return nowHour >= startHour && nowHour <= endHour;
      });
    }

    setFilteredDeals(result);
  };

  useEffect(() => {
    applyFilters();
  }, [cuisineFilter, locationFilter, openNow]);


  const cuisines = [ 
    'All',
    'American',
    'Mexican',
    'Italian',
    'Chinese',
    'Japanese',
    'Korean',
    'Thai',
    'Vietnamese',
    'Indian',
    'Middle Eastern',
    'Mediterranean',
    'African',
    'Latin American',
    'Caribbean',
    'Soul Food',
    'Vegan',
    'Vegetarian',
    'BBQ',
    'Seafood',
    'Desserts',
    'Cafe / Bakery',
    'Other'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
  {/* Log Out Button */}
  <div className="flex justify-end mb-4">
    {!user && (
      <button
        onClick={() => {
          localStorage.clear(); 
          navigate('/register');
        }}
        className="text-sm text-blue-700 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition mr-2">
        Register
      </button> 
      )}
      {!user && (
      <button
        onClick={() => {
          localStorage.clear(); 
          navigate('/login');
        }}
        className="text-sm text-blue-700 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition">
        Login
      </button> 
      )}
    {user && (
      <button
        onClick={() => {
          localStorage.clear(); 
          handleLogout()
          navigate('/login');
        }}
        className="text-sm text-blue-700 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition">
        Log Out
      </button> )}
  </div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 rounded-xl p-6 mb-10 text-center shadow-md">
        <h1 className="text-5xl font-bold text-blue-800 mb-2">GoodEats</h1>
        <p className="text-blue-700 text-lg">Find local food deals near you. Filtered by cuisine, location, and hours</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 sticky top-0 z-20">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {cuisines.map((type) => (
            <button
              key={type}
              onClick={() => setCuisineFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 transform hover:scale-105 ${
                cuisineFilter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <input
            type="text"
            placeholder="Enter ZIP or city"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border px-4 py-2 rounded w-64"
          />
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="1">Within 1 mile</option>
            <option value="5">Within 5 miles</option>
            <option value="10">Within 10 miles</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={openNow} onChange={() => setOpenNow(!openNow)} />
            <span>Open Now</span>
          </label>

          {user && (
            <button
              onClick={() => navigate('/submit')}
              className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700"
            >
              Submit a Deal
            </button>
          )}
        </div>
      </div>

      {/* Deals */}
      {filteredDeals.length === 0 ? (
        <p className="text-center text-gray-500">No deals found. Try adjusting your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="relative border rounded-xl shadow-md p-5 bg-blue-50 hover:bg-blue-100 hover:shadow-xl transition-transform duration-300">
              {deal.upvotes > 10 && (
                <div className="absolute top-2 right-2 bg-yellow-300 text-xs px-2 py-1 rounded-full shadow text-yellow-900 font-semibold">
                  Top Pick
                </div>
              )}
              <h2 className="text-xl font-semibold text-blue-700">{deal.title || 'Untitled Deal'}</h2>
              <p className="text-sm text-gray-600">{deal.restaurant}</p>
              <p className="mt-2 text-green-600 font-bold text-lg">${deal.price}</p>
              <p className="text-sm text-gray-600">Cuisine: {deal.cuisine}</p>
              <p className="text-sm text-gray-600">Location: {deal.location || 'N/A'}</p>
              <p className="text-sm text-gray-600">Hours: {deal.hours || 'N/A'}</p>
              <div className="flex justify-between items-center mt-2">
                <button className="text-sm text-green-500" onClick={() => vote('up', deal.id)}>▲ {deal.votes || 0}</button>
                <button className="text-sm text-red-500" onClick={() => vote('down', deal.id)}>▼ {deal.votes || 0}</button>
              </div>
              <p className="mt-2 text-sm text-gray-700">{deal.description}</p>
              <p className="mt-1 text-xs text-gray-400">Posted by: {deal.user || 'Anonymous'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
