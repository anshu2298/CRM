import { useState, useEffect } from "react";
import "./Profile.css";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-toastify";
function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );
    if (storedUser) {
      const [firstName, ...lastNameParts] =
        storedUser.name.split(" ");
      setFormData({
        firstName,
        lastName: lastNameParts.join(" "),
        email: storedUser.email,
        password: storedUser.password,
        confirmPassword: "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const updatedData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
    };

    try {
      const employeeId = JSON.parse(
        localStorage.getItem("user")
      )._id;

      const response = await fetch(
        API_PATHS.EMPLOYEE.UPDATE(employeeId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile Updated..!", {
          position: "top-right",
          autoClose: 2000,
        });
        localStorage.setItem(
          "user",
          JSON.stringify(data.employee)
        );
      } else {
        toast.error(
          data.message || "Failed to update profile.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Something went wrong. Please try again.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <div className='profile'>
      <div className='profile-form'>
        <div className='form-group'>
          <label htmlFor='firstName'>First name</label>
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
          <label htmlFor='lastName'>Last name</label>
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
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password</label>
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
          <label htmlFor='confirmPassword'>
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

        <button
          className='save-button'
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Profile;
