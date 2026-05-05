import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Briefcase, Award } from 'lucide-react';
import { authAPI, setToken, setUser } from '../../utils/api';
import { AuthComponent } from '../../components/ui/sign-up';

const TechnicianRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    specialization: '',
    experience: '',
    certifications: '',
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
      password: data.password,
      role: 'technician',
      specialization: formData.specialization,
      experience: Number(formData.experience || 0),
      certifications: formData.certifications,
    });

    setToken(response.token);
    setUser(response.user);

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const isDetailsValid = 
    formData.fullName.length > 0 && 
    formData.phone.length > 0 && 
    formData.specialization.length > 0;

  const detailsStep = (
    <div className="w-full space-y-4 text-left">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
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

        <div className="col-span-2 sm:col-span-1">
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

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Experience (yrs)
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="5"
              min="0"
              className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Specialization *
          </label>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select specialization</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="cleaning">Cleaning</option>
            <option value="ac-repair">AC Repair</option>
            <option value="appliance-repair">Appliance Repair</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Certifications
          </label>
          <div className="relative">
            <Award className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <textarea
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="List certifications"
              rows={2}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
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

export default TechnicianRegister;
