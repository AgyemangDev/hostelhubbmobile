import { useState, useEffect, useContext } from "react";
import { supabase } from "../../app/firebase/supabaseConfig";
import { UserContext } from "../../context/UserContext";

export const useRandomAccommodations = (limit = 1) => {
  const { userInfo } = useContext(UserContext);
  const selectedUniversity = userInfo?.institution;

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAccommodations = async () => {
      if (!selectedUniversity) {
        setAccommodations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc('get_random_accommodations', {
          p_institution: selectedUniversity,
          p_limit: limit
        });

        if (error) throw error;

        setAccommodations(data || []);
      } catch (err) {
        console.error("Random accommodations error:", err);
        setError(err.message);
        setAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAccommodations();
  }, [selectedUniversity, limit]);

  return { accommodations, loading, error };
};