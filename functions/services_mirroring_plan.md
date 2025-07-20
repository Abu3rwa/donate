# Backend Services Mirroring Plan

## Objective

Mirror the structure and naming of the client `/src/services` directory in the backend `/functions/services` directory for clarity, maintainability, and easier onboarding.

---

## 1. Client Services to Mirror

From `/src/services/`:

- userService.js
- compaignService.js
- fileUploadService.js
- orgInfoService.js
- expensesService.js
- donationsService.js
- financialReportsService.js
- billsService.js
- expenseModerationService.js
- contentModerationService.js
- dashboardService.js

---

## 2. Recommended Backend Structure

```
functions/
  services/
    user/
      userService.js
      index.js
    campaign/
      campaignService.js
      index.js
    fileUpload/
      fileUploadService.js
      index.js
    orgInfo/
      orgInfoService.js
      index.js
    expenses/
      expensesService.js
      index.js
    donations/
      donationsService.js
      index.js
    financialReports/
      financialReportsService.js
      index.js
    bills/
      billsService.js
      index.js
    expenseModeration/
      expenseModerationService.js
      index.js
    contentModeration/
      contentModerationService.js
      index.js
    dashboard/
      dashboardService.js
      index.js
```

- Each folder contains the main service logic and an `index.js` that exports callable functions.
- Use the same naming as the client for easy mapping.

---

## 3. Mapping Table

| Client Service              | Backend Folder/File                           | Purpose                      |
| --------------------------- | --------------------------------------------- | ---------------------------- |
| userService.js              | user/userService.js                           | User CRUD, auth, profile     |
| compaignService.js          | campaign/campaignService.js                   | Campaign CRUD, logic         |
| fileUploadService.js        | fileUpload/fileUploadService.js               | File uploads, storage ops    |
| orgInfoService.js           | orgInfo/orgInfoService.js                     | Organization info, settings  |
| expensesService.js          | expenses/expensesService.js                   | Expense CRUD, logic          |
| donationsService.js         | donations/donationsService.js                 | Donation CRUD, logic         |
| financialReportsService.js  | financialReports/financialReportsService.js   | Financial reports, summaries |
| billsService.js             | bills/billsService.js                         | Bill management              |
| expenseModerationService.js | expenseModeration/expenseModerationService.js | Expense moderation           |
| contentModerationService.js | contentModeration/contentModerationService.js | Content moderation           |
| dashboardService.js         | dashboard/dashboardService.js                 | Dashboard data, stats        |

---

## 4. Best Practices

- Keep business logic in `*Service.js` files.
- Use `index.js` to export callable functions for Firebase.
- Use the same function and file names as the client for clarity.
- Add validation, email, and utils modules as needed.

---

## 5. Next Steps

1. Scaffold the folder and file structure in `/functions/services/` as above.
2. Move or implement backend logic for each service.
3. Refactor main `functions/index.js` to import/export from each service module.
4. Keep documentation up to date for each service.
