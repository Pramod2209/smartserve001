import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin } from 'lucide-react';
import { authAPI, setToken, setUser } from '../../utils/api';
import { AuthComponent } from '../../components/ui/sign-up';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (data) => {
    const response = await authAPI.register({
      fullName: formData.fullName,
      email: data.email,
      phone: formData.phone,
      address: formData.address,
      password: data.password,
      role: 'customer',
    });

    setToken(response.token);
    setUser(response.user);

    setTimeout(() => {
      navigate('/customer/dashboard');
    }, 1200);
  };

  const isDetailsValid = formData.fullName.length > 0 && formData.phone.length > 0;

  const detailsStep = (
    <div className="w-full space-y-4 text-left">
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
          Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            rows={2}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );

  return (
    <AuthComponent 
      mode="register" 
      brandName="Smart Serve" 
      onSubmit={handleSubmit}
      detailsStepContent={detailsStep}
      isDetailsValid={isDetailsValid}
    />
  );
};

export default CustomerRegister;
