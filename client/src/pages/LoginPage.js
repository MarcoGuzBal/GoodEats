import React, { useState } from 'react' 
import { useNavigate } from 'react-router-dom';
import "./RegistrationPage.css"

function LoginPage() {

  const navigate = useNavigate();

  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost:5000/api/login'

    console.log(formData)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json()
      alert(result.message)
      
      if (response.ok && result.success) {
        console.log(result.message);
        navigate('/')
      }

    } catch (error) {
      console.error("Error", error)
      alert("Failed to connect to server")
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className="inputs">
        <form onSubmit={handleSubmit} >
          <div className="input">
            <label htmlFor="email">Enter your email </label>
            <input type= "email" name="email" value={FormData.email} onChange={handleChange} required />
          </div>
          <div className="input">
            <label hrmlFor="password">Enter your password: </label>
            <input type= "password" name="password" value={FormData.password} onChange={handleChange}required />
          </div>
        </form>
      </div>
      <div className='submit-container'>
        <div className={action==="Submit"?"submit gray":"submit"} onClick={handleSubmit}>Log In</div>
      </div>
    </div>
  )
}

export default LoginPage
