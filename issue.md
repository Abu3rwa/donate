
# Code Review Issues

This document outlines several issues found during a review of the `src` and `functions` directories.

## 1. Hardcoded Firebase Configuration (`src/config/firebase.js`)

**Issue:** The Firebase configuration in `src/config/firebase.js` is hardcoded directly into the source code. This is a major security risk, as it exposes sensitive API keys and project details to anyone with access to the frontend code.

**Recommendation:**
- Move the Firebase configuration to a `.env` file.
- Use environment variables (e.g., `process.env.REACT_APP_FIREBASE_API_KEY`) to load the configuration.
- Add `.env` to the `.gitignore` file to prevent it from being committed to version control.

## 2. Hardcoded User ID and Project ID in Cloud Functions

**Issue:** The Cloud Functions in `functions/check_user.js` and `functions/create_super_admin.js` contain a hardcoded user ID (`4QqqU1WUUnaz6wNjrnLPAXYvivl2`) and project ID (`shoply-31172`).

**Recommendation:**
- **User ID:** Pass the user ID as a parameter or retrieve it dynamically instead of hardcoding it.
- **Project ID:** Use the default Firebase project configuration by calling `admin.initializeApp()` without arguments, which automatically uses the correct project ID when deployed.

## 3. Redundant Cloud Function Code (`functions/test_auth.js`)

**Issue:** The file `functions/test_auth.js` appears to be a duplicate of the `testAuth` function already defined in `functions/index.js`. This creates code duplication and can lead to confusion.

**Recommendation:**
- Remove the `functions/test_auth.js` file and use the `testAuth` function from `functions/index.js`.

## 4. Inconsistent Firestore Field Names in `donationsService.js`

**Issue:** In `src/services/donationsService.js`, the `addDonation` function attempts to update a `raised` field in the `campaigns` collection. However, if that fails, it falls back to updating `currentAmount`. This suggests that the field name for the amount raised in a campaign is inconsistent across the database.

**Recommendation:**
- Standardize the field name for the raised amount in the `campaigns` collection to either `raised` or `currentAmount` and update all relevant code to use the standardized name.

## 5. Lack of Input Validation in Cloud Functions

**Issue:** The `createUserByAdmin` function in `functions/index.js` checks for the existence of `email` and `password` but does not perform any further validation on the data.

**Recommendation:**
- Implement more robust validation for all inputs to the Cloud Function. For example, validate that the email is in a valid format and that the password meets complexity requirements.

## 6. Unused Imports and Variables

**Issue:** Several files, including `src/App.js` and `src/components/dashboard/Dashboard.js`, contain unused imports and variables. This adds clutter to the code and can make it harder to read and maintain.

**Recommendation:**
- Remove all unused imports and variables. Use a linter to automatically identify and remove them.
