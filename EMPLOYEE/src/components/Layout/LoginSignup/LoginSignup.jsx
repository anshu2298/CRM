import { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import "./LoginSignup.css";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const LoginSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(
      formData.email,
      formData.password
    );
    if (result.success) {
      toast.success("Welcome back! 👋", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error(result.message || "Login failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
            <h2>Welcome Back</h2>
            <p>Sign in to your sales dashboard</p>
          </div>

          <form
            className='auth-form'
            onSubmit={handleSubmit}
          >
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

            <button
              type='submit'
              className='submit-btn'
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
