// hooks/hubclippsContext/useHubclippsById.js
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useHubclippsById = () => {
  const { user } = useContext(UserContext);

  const fetchById = async (id) => {
    if (!id || !user) return null;

    const token = await user.getIdToken(false);

    const res = await fetch(
      `${API_BASE_URL}/api/hubclipps/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  };

  return { fetchById };
};