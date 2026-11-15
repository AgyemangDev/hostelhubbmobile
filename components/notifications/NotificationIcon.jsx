import React from "react";
import { Feather } from "@expo/vector-icons";

const NotificationIcon = ({ type, status }) => {
  if (type === "booking") {
    if (status === "accepted") return <Feather name="check-circle" size={24} color="#10B981" />;
    if (status === "cancelled") return <Feather name="x-circle" size={24} color="#EF4444" />;
    if (status === "pending") return <Feather name="clock" size={24} color="#F59E0B" />;
    return <Feather name="calendar" size={24} color="#4F46E5" />;
  }

  return <Feather name="bell" size={24} color="#3B82F6" />;
};

export default NotificationIcon;
