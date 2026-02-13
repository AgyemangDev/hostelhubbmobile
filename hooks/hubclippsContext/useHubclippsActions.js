// hooks/hubclippsContext/useHubclippsActions.js
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useHubclippsActions = () => {
  const { user } = useContext(UserContext);

  const update = async (id, payload) => {
    if (!user) return null;

    const token = await user.getIdToken(false);

    const res = await fetch(
      `${API_BASE_URL}/api/hubclipps/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return res.ok ? (await res.json()).data : null;
  };

  return {
    incrementView: (id) => update(id, { updateType: "view" }),
    toggleAvailability: (id) =>
      update(id, { updateType: "availability" }),
  };
};
