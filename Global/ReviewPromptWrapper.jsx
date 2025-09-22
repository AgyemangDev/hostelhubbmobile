// Global/ReviewPromptWrapper.jsx
import { useReviewPrompt } from "../hooks/useReviewPrompt";

const ReviewPromptWrapper = () => {
  const { triggerAfterAction } = useReviewPrompt();

  // Expose global trigger function
  global.triggerReviewPrompt = triggerAfterAction;

  // No UI needed, just hook into lifecycle
  return null;
};

export default ReviewPromptWrapper;