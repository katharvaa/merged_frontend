import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ArrowLeft, Save, User, Phone, Mail, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { workersAPI } from '../utils/api';
import { validateForm, validateRequired, validateEmail, validatePhone, formatSuccessMessage, trimInput } from '../utils/validation';

const CreateWorker = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roleId: '',
    status: 'available',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: '002', name: 'Scheduler' },
    { id: '003', name: 'Worker' },
  ];

  const handleInputChange = (field, value) => {
    const trimmed = trimInput(value);
    setFormData(prev => ({ ...prev, [field]: trimmed }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateFormData = () => {
    const rules = {
      name: [(v) => validateRequired(v, 'Worker Name')],
      phone: [
        (v) => validateRequired(v, 'Phone Number'),
        (v) => validatePhone(v, 'Phone Number')
      ],
      email: [
        (v) => validateRequired(v, 'Email'),
        (v) => validateEmail(v, 'Email')
      ],
      roleId: [(v) => validateRequired(v, 'Role')],
    };
    const { isValid, errors: validationErrors } = validateForm(formData, rules);
    return { isValid, errors: validationErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateFormData();
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await workersAPI.create({ ...formData });
      toast.success(formatSuccessMessage('create', 'Worker'));
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to create worker');
      if (err.response?.data?.fieldErrors) {
        setErrors(err.response.data.fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
      className="p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto"
    >
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={onBack} disabled={loading}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          Create Worker
        </h1>
      </div>

      <Card className="w-full">
        <CardHeader className="pt-6 pb-4 px-6">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Worker Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Worker Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Worker Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter worker name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.roleId}
                  onValueChange={value => handleInputChange('roleId', value)}
                >
                  <SelectTrigger className={errors.roleId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.id} - {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && <p className="text-sm text-red-500">{errors.roleId}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Create Worker</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateWorker;
