// utils/hostelViewCountUtil.js
import { supabase } from "../app/firebase/supabaseConfig";

/**
 * Updates the view count for a hostel in Supabase
 * @param {string} hostelId - The ID of the hostel to update
 */
export const updateHostelViewCount = async (hostelId) => {
  try {
    if (!hostelId) {
      console.warn("No hostelId provided to updateHostelViewCount");
      return;
    }

    // First, get the current number of views
    const { data: hostel, error: fetchError } = await supabase
      .from("accommodation")
      .select("views")
      .eq("id", hostelId)
      .single();

    if (fetchError) {
      console.error("Error fetching hostel views:", fetchError);
      return;
    }

    // Increment views
    const newViews = (hostel.views || 0) + 1;

    const { error: updateError } = await supabase
      .from("accommodation")
      .update({ views: newViews })
      .eq("id", hostelId);

    if (updateError) {
      console.error("Error updating hostel views:", updateError);
    } else {
      console.log(`Updated views for hostel ${hostelId} to ${newViews}`);
    }
  } catch (error) {
    console.error("Unexpected error updating hostel views:", error);
  }
};