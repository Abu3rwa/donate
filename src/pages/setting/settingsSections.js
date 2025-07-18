import React from "react";
import {
  Business,
  Info,
  CreditCard,
  Mail,
  Palette,
  Favorite,
  Security,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const OrganizationInfoForm = React.lazy(() => import("./OrganizationInfoForm"));
const AboutUsEditor = React.lazy(() => import("./AboutUsEditor"));
const BankAccountsList = React.lazy(() => import("./BankAccountsList"));
const ContactInfoForm = React.lazy(() => import("./ContactInfoForm"));
const ThemeSelector = React.lazy(() => import("./ThemeSelector"));
const SocialLinksEditor = React.lazy(() => import("./SocialLinksEditor"));
const DonationSettingsForm = React.lazy(() => import("./DonationSettingsForm"));
const PrivacyPolicyEditor = React.lazy(() => import("./PrivacyPolicyEditor"));
const CustomFieldsManager = React.lazy(() => import("./CustomFieldsManager"));

export const SECTIONS = [
  {
    key: "org",
    label: "معلومات الجمعية",
    component: OrganizationInfoForm,
    icon: <Business />,
  },
  {
    key: "about",
    label: "من نحن",
    component: AboutUsEditor,
    icon: <Info />,
  },
  {
    key: "banks",
    label: "الحسابات البنكية",
    component: BankAccountsList,
    icon: <CreditCard />,
  },
  {
    key: "social",
    label: "روابط التواصل الاجتماعي",
    component: SocialLinksEditor,
    icon: <Mail />,
  },
  {
    key: "contact",
    label: "بيانات التواصل",
    component: ContactInfoForm,
    icon: <Mail />,
  },
  {
    key: "theme",
    label: "المظهر والثيم",
    component: ThemeSelector,
    icon: <Palette />,
  },
  {
    key: "donation",
    label: "إعدادات التبرع",
    component: DonationSettingsForm,
    icon: <Favorite />,
  },
  {
    key: "privacy",
    label: "سياسة الخصوصية",
    component: PrivacyPolicyEditor,
    icon: <Security />,
  },
  {
    key: "custom",
    label: "حقول مخصصة",
    component: CustomFieldsManager,
    icon: <SettingsIcon />,
  },
];
