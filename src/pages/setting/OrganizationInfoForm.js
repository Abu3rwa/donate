import React, { useState, useEffect } from "react";
import OrganizationBasicInfoForm from "./OrganizationBasicInfoForm";
import SocialLinksEditor from "./SocialLinksEditor";
import { getOrgInfo } from "../../services/orgInfoService";

const OrganizationInfoForm = () => {
  const [orgInfo, setOrgInfo] = useState({});

  useEffect(() => {
    const fetchOrg = async () => {
      const info = await getOrgInfo();
      setOrgInfo(info || {});
    };
    fetchOrg();
  }, []);

  return (
    <div className="space-y-8">
      <OrganizationBasicInfoForm />
    </div>
  );
};

export default OrganizationInfoForm;
