import { useState } from 'react';

export const useBookingForm = () => {
  const [formData, setFormData] = useState({
    selectedPayment: null,
    selectedRoomType: '',
    selectedRoomTypeId: null,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
    setFormData({
      selectedPayment: null,
      selectedRoomType: '',
      selectedRoomTypeId: null,
    });
  };

  return {
    formData,
    handleInputChange,
    resetFormData,
  };
};