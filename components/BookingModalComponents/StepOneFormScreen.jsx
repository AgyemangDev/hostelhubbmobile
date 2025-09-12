import React from 'react';
import BookingFormFields from './BookingFormFields';

const StepOneFormScreen = ({ 
    formData, 
    handleInputChange, 
    hostelData, 
    handleSelectPaymentRange 
  }) => {
    return (
      <BookingFormFields 
        formData={formData} 
        handleInputChange={handleInputChange}
        hostelData={hostelData}
        handleSelectPaymentRange={handleSelectPaymentRange}
      />
    );
  };

export default StepOneFormScreen;
