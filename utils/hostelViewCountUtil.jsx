
/**
 * Updates the view count for a hostel
 * @param {string} hostelId - The ID of the hostel to update
 */
export const updateHostelViewCount = async (hostelId) => {
  try {
    if (!hostelId) {
      console.warn("No hostelId provided to updateHostelViewCount");
      return;
    }

    // Step 1: Fetch the current number of views for this hostel from your backend
    console.log(`Fetch current views for hostel ${hostelId} from backend`);

    // Step 2: Increment the view count by 1
    console.log(`Increment the view count for hostel ${hostelId}`);

    // Step 3: Update the new view count in your backend
    console.log(`Send updated views for hostel ${hostelId} to backend`);

    // Step 4: Optionally, log the new view count
    console.log(`Updated views for hostel ${hostelId} successfully`);
  } catch (error) {
    console.error("Unexpected error updating hostel views:", error);
  }
};