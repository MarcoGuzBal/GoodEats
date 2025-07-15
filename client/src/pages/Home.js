import React, { useEffect, useState } from 'react';

function Home() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/deals')
      .then((res) => res.json())
      .then((data) => setDeals(data))
      .catch((err) => console.error("Error fetching deals:", err));
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Nearby Food Deals</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {deals.map((deal) => (
          <li key={deal.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <h2>{deal.restaurant}</h2>
            <p>{deal.description}</p>
            <p>Price: ${deal.price}</p>
            <p>Valid on: {deal.days}</p>
            <p>Posted by: {deal.user}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
