import { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "Sarthak",
    lastName: "Pal",
    email: "Sarthakpal08@gmail.com",
    password: "************",
    confirmPassword: "************",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Handle save logic here
    console.log("Profile updated:", formData);
  };

  return (
    <div className='settings-page'>
      <div className='settings-content'>
        <div className='profile-form-container'>
          <h2 className='form-title'>Edit Profile</h2>

          <form
            onSubmit={handleSave}
            className='profile-form'
          >
            <div className='form-group'>
              <label
                htmlFor='firstName'
                className='form-label'
              >
                First name
              </label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                className='form-input'
              />
            </div>

            <div className='form-group'>
              <label
                htmlFor='lastName'
                className='form-label'
              >
                Last name
              </label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                className='form-input'
              />
            </div>

            <div className='form-group'>
              <label
                htmlFor='password'
                className='form-label'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className='form-input'
              />
            </div>

            <div className='form-group'>
              <label
                htmlFor='confirmPassword'
                className='form-label'
              >
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label
                htmlFor='email'
                className='form-label'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='form-input'
              />
            </div>

            <div className='form-actions'>
              <button
                type='submit'
                className='save-btn'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
