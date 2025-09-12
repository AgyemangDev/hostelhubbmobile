// components/ReviewPromptWrapper.jsx
import React from "react";
import ReviewModal from "../components/Modal/ReviewModal";
import { useReviewPrompt } from "../hooks/useReviewPrompt";

const ReviewPromptWrapper = () => {
  const {
    shouldShowModal,
    setShouldShowModal,
    triggerAfterAction,
    markAsRated,
  } = useReviewPrompt();

  global.triggerReviewPrompt = triggerAfterAction;

  return (
    <ReviewModal
      visible={shouldShowModal}
      onClose={() => setShouldShowModal(false)}
      markAsRated={markAsRated}
    />
  );
};

export default ReviewPromptWrapper;
