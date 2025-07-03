import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Edit, Search, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { usePickup } from '../contexts/PickupContext';
import { validateForm, validateRequired, validateEmail, validatePhone, trimInput, formatSuccessMessage } from '../utils/validation';
import { workersAPI } from '../utils/api';

const UpdateWorker = ({ onBack, onSuccess, initialWorkerId = null }) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState(initialWorkerId || '');
  const [workerData, setWorkerData] = useState(null);
  const [formData, setFormData] = useState({ phone: '', email: '', status: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch list of workers from context or API
  const { workers, updateWorker } = usePickup();
  const workerStatuses = ['available', 'occupied', 'absent'];

  useEffect(() => {
    if (selectedWorkerId) {
      setDataLoading(true);
      workersAPI.getById(selectedWorkerId)
        .then(res => {
          const w = res.data || res;
          setWorkerData(w);
          setFormData({ phone: w.phone || '', email: w.email || '', status: w.status || '' });
        })
        .catch(() => toast.error('Failed to load worker details'))
        .finally(() => setDataLoading(false));
    } else {
      setWorkerData(null);
      setFormData({ phone: '', email: '', status: '' });
    }
  }, [selectedWorkerId, workers]);

  const handleInputChange = (field, value) => {
    const trimmed = field === 'email' ? value : trimInput(value);
    setFormData(prev => ({ ...prev, [field]: trimmed }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateFormData = () => {
    const rules = {
      phone: [v => validateRequired(v, 'Phone'), v => validatePhone(v, 'Phone')],
      email: [v => validateRequired(v, 'Email'), v => validateEmail(v, 'Email')],
      status: [v => validateRequired(v, 'Status')]
    };
    return validateForm(formData, rules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateFormData();
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    setLoading(true);
    try {
      await workersAPI.update(selectedWorkerId, formData);
      toast.success(formatSuccessMessage('update', 'Worker'));
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to update worker');
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
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={onBack} disabled={loading}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          Update Worker
        </h1>
      </div>

      {/* Worker Selection */}
      <Card className="w-full mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Select Worker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="workerId" className="text-sm font-medium">
              Worker ID <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a worker to update" />
              </SelectTrigger>
              <SelectContent>
                {workers.map(w => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.id} - {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workerId && <p className="text-sm text-red-500">{errors.workerId}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Update Form */}
      {selectedWorkerId && (
        <Card className="w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Update Worker Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : workerData ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number <span className="text-red-500">*</span></span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email <span className="text-red-500">*</span></span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Worker Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.status} onValueChange={value => handleInputChange('status', value)}>
                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {workerStatuses.map(s => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Update Worker</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-center text-sm text-muted-foreground">No worker data found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default UpdateWorker;
