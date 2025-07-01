import { useState, useEffect } from "react";
import "./Settings.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "***********",
    confirmPassword: "***********",
  });

  // Fetch admin data on mount
  const fetchAdminData = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin-auth/getUser"
      );
      if (!res.ok)
        throw new Error("Failed to fetch admin data");

      const data = await res.json();
      const user = data[0];

      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email || "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3000/api/admin-auth/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      console.log("Profile updated successfully:", data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.message
      );
      alert("Error updating profile. Please try again.");
    }
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
