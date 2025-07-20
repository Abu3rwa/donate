# Modularization Plan for Cloud Functions: Donations, Campaigns, Expenses

## Objective

Design a scalable, maintainable, and clear folder structure for Firebase Cloud Functions to handle donations, campaigns, and expenses, with separation of business logic, validation, and callable endpoints.

---

## 1. Recommended Folder Structure

```
functions/
  services/
    donations/
      index.js           # Exports all donation-related functions
      donationService.js # Business logic for donations
      donationValidation.js # Input validation for donations
      donationEmail.js   # Email notifications for donations (optional)
    campaigns/
      index.js           # Exports all campaign-related functions
      campaignService.js # Business logic for campaigns
      campaignValidation.js
      campaignEmail.js
    expenses/
      index.js           # Exports all expense-related functions
      expenseService.js
      expenseValidation.js
      expenseEmail.js
  utils/
    firestoreHelpers.js  # Common Firestore helpers
    authHelpers.js       # Common authentication/authorization helpers
    emailHelpers.js      # Common email sending logic
  index.js               # Main entry point, imports and exports all modules
```

---

## 2. Module Responsibilities

- **index.js (root):**

  - Imports and exports all callable functions from each service module.
  - Keeps the main entry point clean and organized.

- **services/[entity]/index.js:**

  - Exports all callable functions for that entity (e.g., createDonation, deleteDonation, etc.).
  - Handles only request/response and error handling.

- **services/[entity]/[entity]Service.js:**

  - Contains business logic (e.g., Firestore operations, calculations).
  - No direct request/response handling.

- **services/[entity]/[entity]Validation.js:**

  - Contains input validation logic (e.g., using Yup or custom checks).

- **services/[entity]/[entity]Email.js:**

  - Handles email notifications related to the entity (optional, if needed).

- **utils/:**
  - Shared helpers for Firestore, authentication, and email.

---

## 3. Example: How a Function Flows

1. **Callable function** (in `services/donations/index.js`) receives the request.
2. **Validates input** using `donationValidation.js`.
3. **Checks permissions** using `authHelpers.js`.
4. **Performs business logic** in `donationService.js` (e.g., add to Firestore).
5. **Sends notification** using `donationEmail.js` (if needed).
6. **Returns response** or error.

---

## 4. Best Practices

- Keep each file focused on a single responsibility.
- Use shared utils for repeated logic (e.g., auth, Firestore queries, email).
- Use clear naming conventions for files and functions.
- Document each function and module.
- Write unit tests for business logic (optional, but recommended).
- Use environment variables for sensitive config (e.g., email credentials).

---

## 5. Next Steps

1. Create the folder structure above.
2. Move existing user logic into `services/users/` (optional for consistency).
3. Implement CRUD and business logic for each entity in its own module.
4. Refactor the main `index.js` to import/export from each service.
5. Add validation and email modules as needed.

---

## 6. Example Exports in Main index.js

```js
// functions/index.js
const { createDonation, deleteDonation } = require("./services/donations");
const { createCampaign } = require("./services/campaigns");
const { addExpense } = require("./services/expenses");

exports.createDonation = createDonation;
exports.deleteDonation = deleteDonation;
exports.createCampaign = createCampaign;
exports.addExpense = addExpense;
```
