import React, { useState } from 'react';
import { Upload, Plane } from 'lucide-react';
import './touristSafetyLanding.css';

const TouristSafetyLanding = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    email: '',
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document') {
      setFormData({ ...formData, document: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data for sending
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('contact', formData.contact);
      data.append('email', formData.email);
      data.append('document', formData.document);

      // Make POST request
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: data, // FormData handles file uploads + text fields
      });

      if (response.ok) {
        const result = await response.json();
        alert(`🎉 Registration successful!\n\nDigital ID: ${result.digitalId}`);
      } else {
        alert('⚠️ Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ Failed to submit form.');
    }
  };

  return (
    <div className="landing-container">
      
      {/* Top Tagline */}
      <div className="tagline">
        <h2>Welcome to Smart Tourist Safety</h2>
      </div>

      <div className="landing-wrapper">
        <div className="main-card">
          
          {/* Logo */}
          <div className="logo-section">
            <div className="logo">
              <Plane size={28} />
            </div>
            <h1 className="main-title">Smart Tourist Safety</h1>
            <p className="subtitle">
              Secure your journey with AI-powered geo-fencing and blockchain-based digital identity
            </p>
          </div>

          {/* Registration Form */}
          <form className="registration-form" onSubmit={handleSubmit}>
            
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />

            <input 
              type="tel" 
              name="contact" 
              placeholder="Contact Number" 
              value={formData.contact} 
              onChange={handleChange} 
              required 
            />

            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />

            <div className="file-upload">
              <label htmlFor="document" className="upload-label">
                <Upload size={20} /> Upload Aadhaar / Passport
              </label>
              <input 
                type="file" 
                id="document" 
                name="document" 
                accept=".jpg,.jpeg,.png,.pdf" 
                onChange={handleChange} 
                required 
              />
              {formData.document && <p className="file-name">{formData.document.name}</p>}
            </div>

            <button type="submit" className="submit-btn">
              Register and Get Digital ID
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        Ministry of Tourism / Ministry of Home Affairs / Government of India / SIH25
      </footer>
    </div>
  );
};

export default TouristSafetyLanding;