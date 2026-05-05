import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { authAPI, setToken, setUser } from '../../utils/api';
import { AuthComponent } from '../../components/ui/sign-up';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');

  const handleSubmit = async (data) => {
    const response = await authAPI.login({
      email: data.email,
      password: data.password,
      role: role,
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
  };

  const detailsStep = (
    <div className="w-full space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Login As
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <AuthComponent 
      mode="login" 
      brandName="Smart Serve" 
      onSubmit={handleSubmit}
      detailsStepContent={detailsStep}
      isDetailsValid={true}
    />
  );
};

export default Login;
