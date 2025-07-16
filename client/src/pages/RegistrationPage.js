import React, { useState } from 'react'
import "./RegistrationPage.css"

function RegistrationPage() {

  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost:5000/api/register'

    console.log(formData)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json()
      alert(result.message)

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
        <div className={action==="Login"?"submit gray":"submit"} onClick={handleSubmit}>Sign Up</div>
        <div className={action==="Submit"?"submit gray":"submit"} onClick={() =>{setAction("Login")}}>Log In</div>
      </div>
    </div>
  )
}

export default RegistrationPage
