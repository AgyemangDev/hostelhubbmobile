import API_BASE_URL from "./api/api";

export const updateHostelViewCount = async (hostelId) => {
  try {
    if (!hostelId) {
      console.warn("No hostelId provided to updateHostelViewCount");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/accommodations/${hostelId}/view`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      console.warn(`Failed to increment views for hostel ${hostelId}:`, response.status);
      return;
    }

    console.log(`Updated views for hostel ${hostelId} successfully`);
  } catch (error) {
    console.error("Unexpected error updating hostel views:", error);
  }
};