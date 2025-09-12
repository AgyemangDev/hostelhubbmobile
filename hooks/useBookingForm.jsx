import { useState } from 'react';

export const useBookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    program: '',
    college: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    selectedPayment: null,
    selectedRoomType: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setInitialFormData = (initialData) => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  };

  const resetFormData = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      program: '',
      college: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      selectedPayment: null,
      selectedRoomType: '',
    });
  };

  return {
    formData,
    handleInputChange,
    setInitialFormData,
    resetFormData
  };
};