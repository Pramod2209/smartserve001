import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Alert from '../../components/Alert';
import { authAPI, setToken, setUser } from '../../utils/api';

/**
 * Login page with role selector
 * Supports Customer, Technician, and Admin login
 */
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setToken(response.token);
      setUser(response.user);

      switch (response.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'technician':
          navigate('/technician/dashboard');
          break;
        case 'customer':
        default:
          navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Main Login Content */}
      <div className="w-full max-w-4xl">
        {/* Back to Home Link */}
        <div className="mb-5">
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Split Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col md:flex-row min-h-[520px]">

          {/* Left Panel - Welcome */}
          <div className="relative md:w-[45%] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 flex flex-col justify-center overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-sm"></div>
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-white/5"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
                Welcome
              </h2>
              <p className="text-xl text-blue-100 font-medium mb-6">
                Smart Serve Platform
              </p>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                Access your personalized dashboard to manage bookings, track services, and connect with verified professionals — all in one place.
              </p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:w-[55%] bg-gray-900/95 backdrop-blur-xl p-10 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <h1 className="text-2xl font-bold text-white mb-1">
                Sign in
              </h1>
              <p className="text-gray-400 text-sm mb-7">
                Enter your credentials to access your account
              </p>

              {/* Error Alert */}
              {error && (
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError('')}
                  className="mb-5"
                />
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Login As
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-gray-400">Remember me</span>
                  </label>
                  <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 transition-all duration-200 text-sm"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Register Links */}
              <div className="mt-6 pt-5 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Don't have an account?
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/register/customer"
                    className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg text-center transition-colors border border-gray-700"
                  >
                    Register as Customer
                  </Link>
                  <Link
                    to="/register/technician"
                    className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg text-center transition-colors border border-gray-700"
                  >
                    Register as Technician
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
