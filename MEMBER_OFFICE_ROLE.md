# MEMBER_OFFICE_ROLE.md

## Purpose

Defines the `memberOfficeRole` field for user documents, its mapping to `adminType`, and how it should be used in both the UI and backend (Cloud Functions) for user management.

---

## 1. Field Definition

- **Field Name:** `memberOfficeRole`
- **Type:** String (enum)
- **Purpose:** Represents the member’s official position in the executive office, as per internal regulations.

---

## 2. Possible Values & Mapping

| Arabic Label    | English Key           | Description            | Linked adminType      |
| --------------- | --------------------- | ---------------------- | --------------------- |
| الرئيس          | president             | رئيس المكتب التنفيذي   | president             |
| الأمين المالي   | finance_manager       | مسؤول الشؤون المالية   | finance_manager       |
| الأمين الإعلامي | communication_manager | مسؤول الإعلام والتوثيق | communication_manager |
| عضو استشاري     | consultant            | عضو استشاري            | consultant            |
| عضو مؤسس        | founding_member       | عضو مؤسس               | founding_member       |
| عضوية شرفية     | honorary_member       | عضوية شرفية            | honorary_member       |
| عضو             | member                | عضو عادي               | (any)                 |

---

## 3. Relationship to `adminType` and `role`

- `memberOfficeRole`: Human-readable, organization-specific title (Arabic for UI).
- `adminType`: System-level key for permissions and logic (English, sent to backend).
- `role`: Further granularity (e.g., "مسؤول", "مشارك", "مشرف").
- **Mapping:** UI should map `memberOfficeRole` (Arabic) to `adminType` (English) for backend logic.

---

## 4. UI Implementation

- **User Creation/Editing:**
  - Add a dropdown for `memberOfficeRole` (Arabic labels) in Add/Edit User forms.
  - When a role is selected, auto-set the corresponding `adminType` (hidden or read-only field).
  - Optionally, allow manual override for advanced users.
- **Display:**
  - Show `memberOfficeRole` in user lists, profiles, and reports (Arabic label).
  - Use `adminType` for permission checks and logic.
- **Validation:**
  - Ensure `memberOfficeRole` and `adminType` are consistent.

---

## 5. Cloud Function: createUserByAdmin

- **Input:**
  - Accept both `memberOfficeRole` (Arabic) and `adminType` (English) in the request body.
  - Validate that the mapping is correct (e.g., if `memberOfficeRole` is "الأمين المالي", `adminType` must be `finance_manager`).
- **Storage:**
  - Store both fields in the Firestore user document.
  - Use `adminType` for permission logic, but keep `memberOfficeRole` for display and reporting.
- **Backward Compatibility:**
  - If `memberOfficeRole` is missing, infer from `adminType` if possible.

---

## 6. Example User Document

```json
{
  "displayName": "عبدالحفيظ اسماعيل",
  "email": "3bdulhafeez.sd@gmail.com",
  "adminType": "finance_manager",
  "memberOfficeRole": "الأمين المالي",
  "role": "مسؤول",
  "permissions": ["manage_finances", "view_reports"],
  "membershipStatus": "active"
}
```

---

## 7. Implementation Steps

1. Update role/office role maps in frontend constants/helpers.
2. Add `memberOfficeRole` dropdown to Add/Edit User forms.
3. Sync `adminType` automatically based on `memberOfficeRole` selection.
4. Update userService and Cloud Function to accept/store both fields.
5. Display `memberOfficeRole` in user lists and profiles.
6. Add validation to ensure mapping consistency.

---

## 8. Future Extensions

- Add more roles as needed.
- Use `memberOfficeRole` for filtering, reporting, and access control in the UI.
