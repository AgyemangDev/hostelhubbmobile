import { useState } from 'react';

export const useBookingForm = () => {
  const [formData, setFormData] = useState({
    selectedPayment: null,
    selectedRoomType: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
    setFormData({
      selectedPayment: null,
      selectedRoomType: '',
    });
  };

  return {
    formData,
    handleInputChange,
    resetFormData,
  };
};