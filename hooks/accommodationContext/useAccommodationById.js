// hooks/accommodationContext/useAccommodationById.js
import { useEffect, useState } from "react";
import { supabase } from "../../app/firebase/supabaseConfig";

export const useAccommodationById = (accommodationId) => {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accommodationId) {
      setLoading(false);
      return;
    }

    const fetchAccommodation = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("accommodation")
          .select(`
            *,
            room_types: accommodation_room_types(*),
            owner: manager_id (
              id,
              firstname,
              surname,
              email,
              phone,
              address,
              expopushtoken
            )
          `)
          .eq("id", accommodationId)
          .single();

        if (error) throw error;

        setAccommodation(data);
      } catch (err) {
        setError(err.message);
        setAccommodation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [accommodationId]);

  return { accommodation, loading, error };
};