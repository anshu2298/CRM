import React, { useState } from "react";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className='auth-container'>
      <div className='auth-background'></div>

      <div className='auth-content'>
        <div className='auth-card'>
          <div className='auth-header'>
            <div className='logo'>
              <TrendingUp
                className='logo-icon'
                size={32}
              />
              <h1>CanovaCRM</h1>
            </div>
            <h2>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p>
              {isLogin
                ? "Sign in to your sales dashboard"
                : "Join thousands of sales professionals"}
            </p>
          </div>

          <form
            className='auth-form'
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <div className='form-row'>
                <div className='form-grp'>
                  <label htmlFor='firstName'>
                    First Name
                  </label>
                  <div className='input-wrapper'>
                    <User
                      className='input-icon'
                      size={18}
                    />
                    <input
                      type='text'
                      id='firstName'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder='Enter your first name'
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className='form-grp'>
                  <label htmlFor='lastName'>
                    Last Name
                  </label>
                  <div className='input-wrapper'>
                    <User
                      className='input-icon'
                      size={18}
                    />
                    <input
                      type='text'
                      id='lastName'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder='Enter your last name'
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='form-grp'>
              <label htmlFor='email'>Email Address</label>
              <div className='input-wrapper'>
                <Mail
                  className='input-icon'
                  size={18}
                />
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Enter your email'
                  required
                />
              </div>
            </div>

            <div className='form-grp'>
              <label htmlFor='password'>Password</label>
              <div className='input-wrapper'>
                <Lock
                  className='input-icon'
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className='form-grp'>
                <label htmlFor='confirmPassword'>
                  Confirm Password
                </label>
                <div className='input-wrapper'>
                  <Lock
                    className='input-icon'
                    size={18}
                  />
                  <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Confirm your password'
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button
              type='submit'
              className='submit-btn'
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className='auth-footer'>
            <p>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type='button'
                className='toggle-btn'
                onClick={toggleMode}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
