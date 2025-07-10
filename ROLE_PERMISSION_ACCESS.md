# Role & Permission-Based Access Control in This App

This app uses a **role and permission-based access control system** to manage what users can see and do, both in the UI and in Firestore.

---

## 1. **Roles and Permissions Overview**

- **Roles** (admin types) are high-level categories for users (e.g., super_admin, admin, donation_manager).
- **Permissions** are fine-grained actions a user can perform (e.g., manage_donations, manage_campaigns).
- Each role is mapped to a set of default permissions, but a user's actual permissions are stored in their Firestore user document and can be customized.

### **Example Roles (adminType)**
| Role (adminType)         | Description                |
|-------------------------|----------------------------|
| super_admin             | Full system access         |
| admin                   | Broad management           |
| moderator               | Content/volunteer moderation |
| donation_manager        | Donation management        |
| campaign_manager        | Campaign management        |
| finance_manager         | Financial management       |
| volunteer_coordinator   | Volunteer management       |
| communication_manager   | Communication management   |
| (none)                  | Regular user               |

### **Example Permissions**
| Permission Key         | Description                |
|-----------------------|----------------------------|
| manage_donations      | Manage donations           |
| manage_campaigns      | Manage campaigns           |
| manage_users          | Manage users               |
| manage_finances       | Manage finances            |
| manage_volunteers     | Manage volunteers          |
| moderate_content      | Moderate content           |
| view_reports          | View reports               |
| ...                   | ...                        |

---

## 2. **How Access Control Works**

### **Firestore Security Rules**
- Firestore rules use the `adminType` field to determine who can read/write to each collection.
- Example: Only users with `adminType: "donation_manager"` or `"super_admin"` can write to the donations collection.
- Regular users can only create/update their own user document.

### **Frontend UI (React)**
- The UI uses the user's `permissions` array (from their Firestore user document) to enable or disable buttons and actions.
- **Each action button is enabled only if the user has the specific permission for that action** (or has "all").
- If the user does not have permission, the button is disabled and styled as unavailable, with a clear message.
- The UI does **not** rely on adminType for access control—only the permissions array.

---

## 3. **How to Add or Change Roles/Permissions**

- **To add a new role:**
  1. Add it to the `ADMIN_PERMISSIONS` mapping in `AuthContext.js` with its default permissions.
  2. Update Firestore rules if this role should have write access to certain collections.
- **To add a new permission:**
  1. Add it to the `PERMISSIONS_AR` mapping (for Arabic display).
  2. Assign it to roles in `ADMIN_PERMISSIONS` as needed.
  3. Use the permission key in the `ALL_ACTIONS` array in `QuickActions.js` for UI actions.

---

## 4. **How to Grant or Revoke Permissions**

- **Grant:** Add the permission key to the user's `permissions` array in their Firestore user document.
- **Revoke:** Remove the permission key from the user's `permissions` array.
- Changes take effect immediately in the UI and are enforced by Firestore rules (if applicable).

---

## 5. **Best Practices**
- Always use the permissions array for UI access checks.
- Use Firestore rules to enforce backend security based on `adminType`.
- Keep the `ADMIN_PERMISSIONS` mapping and Firestore rules in sync for clarity and maintainability.

---

## 6. **Example User Document**
```json
{
  "uid": "abc123",
  "email": "user@example.com",
  "adminType": "donation_manager",
  "permissions": ["manage_donations", "view_donation_reports"],
  "role": "مدير التبرعات"
}
```

---

## 7. **Extending the System**
- You can create custom roles or permissions as needed.
- Always update both the frontend mappings and Firestore rules for new roles/permissions.

---

## 8. **Troubleshooting**
- If a user cannot see or use a button, check their `permissions` array in Firestore.
- If a user gets a Firestore permission error, check the Firestore rules for their `adminType`.

---

**This system provides flexible, fine-grained access control for both the UI and backend.** 