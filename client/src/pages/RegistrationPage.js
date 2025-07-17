import React, { useState } from 'react'
import "./RegistrationPage.css"
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {

  const navigate = useNavigate();
  
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost:5000/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json()
      alert(result.message)

      if (response.ok && result.success) {
        console.log(result.message);
        navigate('/login')
      }

    } catch (error) {
      console.error("Error", error);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-1">{action}</h2>
        <div className="h-1 w-20 mx-auto bg-blue-500 rounded-full mb-6"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
          >
            {action}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setAction(action === "Sign Up" ? "Login" : "Sign Up")}
            className="text-sm text-blue-500 hover:underline"
          >
            {action === "Sign Up" ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
