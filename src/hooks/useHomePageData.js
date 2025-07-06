import { useState, useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { testimonials, partners, statistics, featuredStories } from "../data/homePageData";

export const useHomePageData = () => {
  const { getActiveAlerts } = useNotification();
  const [emergencyAlert, setEmergencyAlert] = useState(null);

  // Check for emergency alerts
  useEffect(() => {
    const alerts = getActiveAlerts();
    if (alerts.length > 0) {
      setEmergencyAlert(alerts[0]);
    }
  }, [getActiveAlerts]);

  return {
    emergencyAlert,
    featuredStories,
    testimonials,
    partners,
    statistics,
  };
};
