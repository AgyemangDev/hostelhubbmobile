// hooks/hubclippsContext/useHubclippsById.js
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useHubclippsById = () => {
  const { user } = useContext(UserContext);

  const fetchById = async (id) => {
    if (!id) return null;

    const headers = { "Content-Type": "application/json" };
    if (user) {
      const token = await user.getIdToken(false);
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/hubclipps/${id}`, { headers });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  };

  return { fetchById };
};