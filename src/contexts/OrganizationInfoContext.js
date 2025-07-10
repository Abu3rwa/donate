import React, { createContext, useContext, useEffect, useState } from "react";
import { getOrgInfo, setOrgInfo as setOrgInfoInFirestore } from "../services/orgInfoService";

const OrganizationInfoContext = createContext();

export function OrganizationInfoProvider({ children }) {
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch org info from Firestore
  const refreshOrgInfo = async () => {
    setLoading(true);
    const data = await getOrgInfo();
    setOrgInfo(data);
    setLoading(false);
  };

  // Save org info to Firestore and update state
  const saveOrgInfo = async (data) => {
    await setOrgInfoInFirestore(data);
    await refreshOrgInfo();
  };

  useEffect(() => {
    refreshOrgInfo();
  }, []);

  return (
    <OrganizationInfoContext.Provider value={{ orgInfo, loading, saveOrgInfo, refreshOrgInfo }}>
      {children}
    </OrganizationInfoContext.Provider>
  );
}

export function useOrganizationInfo() {
  return useContext(OrganizationInfoContext);
} 